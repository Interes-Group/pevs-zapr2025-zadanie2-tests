import * as child_process from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';


const COMPILATION_OUTPUT = process.env.BIN_OUTPUT || path.join(process.cwd(), "bin", "gamestats");
const TEST_PROJECT_SOURCE = process.env.TEST_PROJECT_SOURCE || path.join("src", "main.c");
const MAX_POINTS = 15;

if (process.argv.length < 3) {
	console.log("usage: node test-project.js <test project folder>");
	process.exit(1);
}

function cleanup() {
	fs.rmSync(".tui-test", {recursive: true, force: true});
	fs.rmSync("results", {recursive: true, force: true});
	fs.rmSync(path.join("tests", "__snapshots__"), {recursive: true, force: true});
	fs.rmSync(path.join("tui-traces"), {recursive: true, force: true});
	fs.rmSync(COMPILATION_OUTPUT, {force: true});
}

function evaluateResults(results) {
	const pointsPerTest = MAX_POINTS / results.totalScenarios;
	console.log("points per test: ", pointsPerTest);
	let totalPoints = 0;
	results.results.forEach(result => {
		result.totalTests = Object.keys(result.asserts).length;
		result.passedPercentage = Object.values(result.asserts).filter(v => v).length / result.totalTests;
		result.testPoints = pointsPerTest * result.passedPercentage;
		console.log("test: ", result.scenario, " -> ", result.testPoints.toFixed(2), " points");
		totalPoints += result.testPoints;
	});
	results.points = Math.ceil(totalPoints);
	results.percentage = results.points / MAX_POINTS;
	console.log("project evaluated to", results.points, "/", MAX_POINTS, "points (", (results.percentage * 100).toFixed(2), "%)");
}

const testProjectFolder = process.argv[2];
const testProjectSource = path.join(testProjectFolder, TEST_PROJECT_SOURCE);

console.log("test project folder: ", testProjectFolder);
if (!fs.existsSync(testProjectSource)) {
	console.error("test project source not found");
	process.exit(1);
}

cleanup();

console.log("compiling test project");
try {
	child_process.execSync(`gcc -std=c17 -o ${COMPILATION_OUTPUT} -Wall -Wextra ${testProjectSource}`, {stdio: "inherit"});
	console.log("project compiled successfully to ", COMPILATION_OUTPUT);
	console.log("running tests");

	if (!fs.existsSync(COMPILATION_OUTPUT)) throw new Error("cannot find compiled project at " + COMPILATION_OUTPUT);
	try {
		child_process.execSync("npm run test", {stdio: "inherit"});
	} catch (e) {
		console.log("tests failed, running tui-test: ", e);
	}
	console.log("tests finished");

	const testResults = {
		project: testProjectFolder,
		timestamp: new Date().toISOString(),
		results: [],
		totalScenarios: 0,
		percentage: 0,
		points: 0
	};
	console.log("aggregating results");
	fs.readdirSync("results").forEach(file => {
		if (!file.endsWith(".json")) return;
		//console.log("processing result file: ", file);
		const fileContent = fs.readFileSync(path.join("results", file), {encoding: "utf-8"});
		const testResult = JSON.parse(fileContent);
		testResults.results.push(testResult);
		testResults.totalScenarios++;
	});
	evaluateResults(testResults);

	console.log("copying results to project");
	const projectTestsFolder = path.join(testProjectFolder, "test-results", "test-" + (new Date().toISOString().replaceAll(":", "-")));
	fs.mkdirSync(projectTestsFolder, {recursive: true});
	fs.writeFileSync(path.join(projectTestsFolder, "test-results.json"), JSON.stringify(testResults, null, 2));
	fs.mkdirSync(path.join(projectTestsFolder, "snapshots"));
	fs.readdirSync(path.join("tests", "__snapshots__")).forEach(snapshot => {
		fs.copyFileSync(path.join("tests", "__snapshots__", snapshot), path.join(projectTestsFolder, "snapshots", snapshot));
	});
	console.log("results copied successfully");

	console.log("cleanup");
	//cleanup();
	console.log("done");

} catch (e) {
	console.error(e);
	process.exit(1);
}