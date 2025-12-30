import {expect} from "@microsoft/tui-test";
import * as fs from "node:fs";
import * as path from "node:path";

export const EXECUTABLE = "journal";
export const JOURNAL_FILE = "reading_journal.txt";

export function getExecutable() {
	const binDir = process.env.BIN_DIR || path.join(".", "bin");
	return path.join(binDir, EXECUTABLE);
}

export function getRunCmd(executable, command, options) {
	let cmd = executable + " ";
	if (command) cmd += command + " ";
	Object.entries(options).forEach(([key, value]) => {
		cmd += "--" + key + " ";
		if (value) cmd += (value.includes(" ") ? `"${value}"` : value) + " ";
	});
	return cmd.trim();
}

export function writeTestResult(scenarioName, results) {
	const dir = process.env.RESULT_DIR || "results";
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, {recursive: true});
	}
	fs.writeFileSync(path.join(dir, "test-scenario-" + scenarioName + ".json"), JSON.stringify(results, null, 2));
}

export function getFormattedFileLine(options) {
	let line = `${options.name}|`;
	line += `${options.author}|`;
	line += `${options.genre}|`;
	line += `${options.start}|`;
	line += `${options.end ? options.end : ""}|`;
	line += `${options.score ? options.score : ""}|`;
	line += `${options.note ? options.note : ""}`;
	return line;
}

export function removeFile(filePath) {
	if (fs.existsSync(filePath)) fs.rmSync(filePath, {force: true});
}

export function writeToFile(filePath, content) {
	fs.writeFileSync(filePath, content);
}

export function getInitConfig() {
	return {
		cmd: "",
		args: {}
	};
}

export function getInitTestResults(scenarioName, config) {
	return {
		scenario: scenarioName,
		config: config,
		asserts: {
			required: false,
		}
	};
}

export async function executeTest(scenarioName, scenarioConfig, executable, terminal, testFunction) {
	const result = getInitTestResults(scenarioName, scenarioConfig);
	let cmd = getRunCmd(executable, scenarioConfig.cmd, scenarioConfig.args);
	console.log("executing: ", cmd);
	try {
		terminal.submit(cmd);
		await testFunction(terminal, result);
	} finally {
		await expect(terminal).toMatchSnapshot();
		writeTestResult(scenarioName, result);
	}
}