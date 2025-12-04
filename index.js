import * as child_process from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';

if (process.argv.length < 3) {
	console.log("usage: node index.js <test project folder>");
	process.exit(1);
}

const testProjectsFolder = process.argv[2];

function isProjectFolder(folder) {
	return fs.existsSync(path.join(folder, "src", "main.c"));
}

const results = []

fs.readdirSync(testProjectsFolder).forEach(dir => {
	const projectFolder = path.join(testProjectsFolder, dir);
	if (fs.statSync(projectFolder).isFile()) return;
	if (!isProjectFolder(projectFolder)) return;

	const projectPrefix = "pevs-zapr2025-zadanie1-"
	const student = projectFolder.substring(projectFolder.indexOf(projectPrefix) + projectPrefix.length);
	try {
		console.log("--- PROJECT", projectFolder, "- STUDENT", student, "---");
		child_process.execSync(`node src/test-project.js ${projectFolder}`, {stdio: "inherit"}); // TODO archive if not compile
		console.log("--- --- ---\n");

		const resultsFolder = path.join(projectFolder, "test-results");
		const resultDirs = fs.readdirSync(resultsFolder).sort();
		const lastResultDir = resultDirs[resultDirs.length - 1];
		const lastResultFile = path.join(resultsFolder, lastResultDir, "test-results.json");
		const lastResult = JSON.parse(fs.readFileSync(lastResultFile, {encoding: "utf-8"}));

		const testSummary = {
			student: student,
			points: lastResult.points,
			tests: lastResult.results.map(r => {
				return {test: r.scenario, points: r.testPoints}
			}).sort((a, b) => a.test.localeCompare(b.test))
		};
		results.push(testSummary);
	} catch (e) {
		console.error(e);
		results.push({student: student, points: 0, tests: []});
	}
});

let csv = "student;points;";
csv += results[0].tests.map(t => t.test).join(";");
csv += "\n";
results.forEach(r => {
	csv += r.student + ";" + r.points + ";";
	csv += r.tests.map(t => t.points).join(";");
	csv += "\n";
});

fs.writeFileSync(path.join(testProjectsFolder, "test-results" + (new Date().toISOString().replaceAll(":", "-")) + ".csv"), csv);


