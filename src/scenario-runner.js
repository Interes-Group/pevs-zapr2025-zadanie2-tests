import {test} from "@microsoft/tui-test";
import {assertFile, assertFileExists, assertText, sleep} from "./assertions.js";
import {executeTest, getFormattedFileLine, JOURNAL_FILE, removeFile, writeToFile} from "./utils.js";


export function getTestName(scenarioName, config) {
	let testName = "scenario " + scenarioName + " :: " + config.cmd;
	Object.entries(config.args).forEach(([key, value]) => {
		testName += " " + key + "=" + value;
	});
	return testName;
}

function prepareJournalFile(content) {
	let fileContent = content.map(line => {
		let serialized = line.join("|");
		let times = 7 - line.length;
		while (times--) serialized += "|";
		return serialized;
	}).join("\n");
	console.log("journal file content to prepare:", fileContent);
	writeToFile(JOURNAL_FILE, fileContent);
}

export function newCommandTest(terminal, config, result) {
	const entry = config.args;

	result.asserts.fileExists = assertFileExists(JOURNAL_FILE);
	if (!result.asserts.fileExists) return;

	const assert = assertFile(JOURNAL_FILE);
	result.asserts.entryName = assert.has(entry.name);
	result.asserts.entryAuthor = assert.has(entry.author);
	result.asserts.entryGenre = assert.has(entry.genre);
	result.asserts.entryStart = assert.has(entry.start);
	if (entry.end) {
		result.asserts.entryEnd = assert.has(entry.end);
	}
	if (entry.score) {
		result.asserts.entryScore = assert.has(entry.score);
	}
	if (entry.note) {
		result.asserts.entryNote = assert.has(entry.note);
	}
	const formattedLineFile = getFormattedFileLine(entry);
	console.log("formatted line:", formattedLineFile);
	result.asserts.fileLineFormat = assert.has(formattedLineFile);

	result.asserts.required = result.asserts.entryName &&
		result.asserts.entryAuthor &&
		result.asserts.entryGenre &&
		result.asserts.entryStart;

}

export async function listCommandTest(terminal, config, result) {
	result.asserts.fileExists = assertFileExists(JOURNAL_FILE);
	if (!result.asserts.fileExists) return;

	result.asserts.required = true;
	for (const expectedEntry of config.expected) {
		for (let i = 0; i < expectedEntry.length; i++) {
			result.asserts[`entry${i + 1}`] = await assertText(terminal, expectedEntry[i]);
		}
	}
}

export function testScenario(executable, scenarioName, config) {
	const testName = getTestName(scenarioName, config);
	test(testName, async ({terminal}) => {
		if (config.file) {
			prepareJournalFile(config.file);
		}
		await executeTest(
			scenarioName,
			config,
			executable,
			terminal,
			async (terminal, result) => {
				await sleep(100);
				if (config.cmd === "new")
					newCommandTest(terminal, config, result);
				else if (config.cmd === "list")
					await listCommandTest(terminal, config, result);

				if (Object.values(result.asserts).some(v => !v)) {
					const failedAsserts = Object.keys(result.asserts).filter(k => !result.asserts[k]);
					const errorMessage = `some asserts failed: [${failedAsserts.join(", ")}]`;
					console.info(errorMessage);
					if (config.clear) {
						removeFile(JOURNAL_FILE);
					}
					throw new Error(errorMessage);
				}
				if (config.clear) {
					removeFile(JOURNAL_FILE);
				}
			}
		);
	});
}
