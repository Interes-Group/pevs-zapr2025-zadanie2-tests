import {expect} from "@microsoft/tui-test";
import fs from "node:fs";

export async function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export async function assertText(terminal, text = "") {
	try {
		await expect(terminal.getByText(text, {full: true, strict: false})).toBeVisible({timeout: 500});
		return true;
	} catch (e) {
		//console.error("assertion for: ", text, " has failed");
		return false;
	}
}

export async function assertAnyText(terminal, texts = []) {
	for (const text of texts) {
		const assertValue = await assertText(terminal, text);
		if (assertValue) return true;
	}
	return false;
}

export async function assertNameAndValue(terminal, name, values = []) {
	const assertName = await assertText(terminal, name);
	if (!assertName) return false;
	return await assertAnyText(terminal, values);
}

export function assertFileExists(filePath) {
	try {
		return fs.existsSync(filePath);
	} catch (e) {
		return false;
	}
}

export function assertTextInFile(filePath, text) {
	try {
		if (!assertFileExists(filePath)) return false;
		const fileContent = fs.readFileSync(filePath, {encoding: "utf-8"});
		console.log("file content: ", fileContent);
		return fileContent.includes(text);
	} catch (e) {
		console.error("error reading file: ", filePath);
		return false;
	}
}

export function assertFile(filePath) {
	let fileContent = null;
	try {
		fileContent = fs.readFileSync(filePath, {encoding: "utf-8"});
		console.log("file content: ", fileContent);
	} catch (e) {
		console.error("error reading file: ", filePath);
		// file does not exist
	}
	return {
		exists: () => assertFileExists(filePath),
		has: (text) => {
			if (!fileContent) return assertTextInFile(filePath, text);
			return fileContent.includes(text);
		},
		content: fileContent
	}
}