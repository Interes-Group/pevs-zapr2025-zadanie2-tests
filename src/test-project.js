import * as child_process from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as util from 'node:util';
import {EXECUTABLE, JOURNAL_FILE} from "./utils.js";


const COMPILATION_OUTPUT = process.env.BIN_OUTPUT || path.join(process.cwd(), "bin", EXECUTABLE);
const TEST_PROJECT_SOURCE = process.env.TEST_PROJECT_SOURCE || path.join("src", "main.c");
const LOG_TO_FILE = process.env.LOG_TO_FILE || false;
const MAX_POINTS = 15;
var logFile;
const logStdout = process.stdout;

if (process.argv.length < 3) {
	console.log("usage: node test-project.js <test project folder>");
	process.exit(1);
}

function log(...data) {
	if (logFile) logFile.write(util.format(...data) + "\n");
	logStdout.write(util.format(...data) + "\n");
}

function cleanup() {
	fs.rmSync(".tui-test", {recursive: true, force: true});
	fs.rmSync("results", {recursive: true, force: true});
	fs.rmSync(path.join("tests", "__snapshots__"), {recursive: true, force: true});
	fs.rmSync(path.join("tui-traces"), {recursive: true, force: true});
	fs.rmSync(COMPILATION_OUTPUT, {force: true});
	fs.rmSync(JOURNAL_FILE, {force: true});
	fs.mkdirSync("results", {recursive: true});
}

function evaluateResults(results) {
	const pointsPerTest = MAX_POINTS / results.totalScenarios;
	log("points per test:", pointsPerTest);
	let totalPoints = 0;
	results.results.forEach(result => {
		result.totalTests = Object.keys(result.asserts).length;
		result.passedPercentage = Object.values(result.asserts).filter(v => v).length / result.totalTests;
		result.testPoints = pointsPerTest * result.passedPercentage;
		log("test:", result.scenario, "->", result.testPoints.toFixed(2), "points");
		totalPoints += result.testPoints;
	});
	results.points = Math.ceil(totalPoints);
	results.percentage = results.points / MAX_POINTS;
	log("project evaluated to", results.points, "/", MAX_POINTS, "points (", (results.percentage * 100).toFixed(2), "%)");
}

const testProjectFolder = process.argv[2];
const testProjectSource = path.join(testProjectFolder, TEST_PROJECT_SOURCE);

console.log("test project folder: ", testProjectFolder);
if (!fs.existsSync(testProjectSource)) {
	console.error("test project source not found");
	process.exit(1);
}
const testProjectResultsFolder = path.join(testProjectFolder, "test-results", "test-" + (new Date().toISOString().replaceAll(":", "-")));
fs.mkdirSync(testProjectResultsFolder, {recursive: true});
const testLogFile = path.join(testProjectResultsFolder, "tests.log");
logFile = fs.createWriteStream(testLogFile, {flags: "a"});

cleanup();

log("updating repository")
child_process.execSync("git pull", {stdio: "inherit", cwd: testProjectFolder});

log("compiling test project");
try {
	child_process.execSync(`gcc -std=c17 -o ${COMPILATION_OUTPUT} -lm -Wall -Wextra ${testProjectSource} ${LOG_TO_FILE ? `>> ${testLogFile} 2>&1` : ""}`, {stdio: "inherit"});
	log("project compiled successfully to ", COMPILATION_OUTPUT);
	log("running tests");

	if (!fs.existsSync(COMPILATION_OUTPUT)) throw new Error("cannot find compiled project at " + COMPILATION_OUTPUT);
	try {
		child_process.execSync(`npm run tui:test ${LOG_TO_FILE ? `>> ${testLogFile}` : ""}`, {stdio: "inherit"});
	} catch (e) {
		log("tests failed, running tui-test: ", e);
	}
	log("tests finished");

	const testResults = {
		project: testProjectFolder,
		timestamp: new Date().toISOString(),
		results: [],
		totalScenarios: 0,
		percentage: 0,
		points: 0
	};
	log("aggregating results");
	fs.readdirSync("results").forEach(file => {
		if (!file.endsWith(".json")) return;
		//console.log("processing result file: ", file);
		const fileContent = fs.readFileSync(path.join("results", file), {encoding: "utf-8"});
		const testResult = JSON.parse(fileContent);
		testResults.results.push(testResult);
		testResults.totalScenarios++;
	});
	evaluateResults(testResults);

	log("copying results to project");
	fs.writeFileSync(path.join(testProjectResultsFolder, "test-results.json"), JSON.stringify(testResults, null, 2));
	fs.mkdirSync(path.join(testProjectResultsFolder, "snapshots"));
	fs.readdirSync(path.join("tests", "__snapshots__")).forEach(snapshot => {
		fs.copyFileSync(path.join("tests", "__snapshots__", snapshot), path.join(testProjectResultsFolder, "snapshots", snapshot));
	});
	log("results copied successfully");

	log("cleanup");
	cleanup();
	log("done");

	process.exit(0);

} catch (e) {
	log(e);
	process.exit(1);
}