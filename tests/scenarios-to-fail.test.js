import {expect, Shell, test} from "@microsoft/tui-test";
import {executeTest, getExecutable} from "../src/utils.js";

const gamestats = getExecutable()

test.use({shell: Shell.Bash, rows: 25});

test("scenario without kills", async ({terminal}) => {
	await executeTest("tofail-1-without-kills",
		{args: ["--deaths", "1", "--assists", "1", "--duration", "20"]},
		gamestats,
		terminal,
		async (terminal, result) => {
			console.log("'kills' argument was not provided, so a message about missing argument should be printed");
			await expect(terminal.getByText("kills", {full: true, strict: false})).toBeVisible({timeout: 200});
			result.asserts.required = true;
		})
});

test("scenario without deaths", async ({terminal}) => {
	await executeTest("tofail-1-without-deaths",
		{args: ["--kills", "1", "--assists", "1", "--duration", "20"]},
		gamestats,
		terminal,
		async (terminal, result) => {
			console.log("'deaths' argument was not provided, so a message about missing argument should be printed");
			await expect(terminal.getByText("deaths", {full: true, strict: false})).toBeVisible({timeout: 200});
			result.asserts.required = true;
		})
});

test("scenario without assists", async ({terminal}) => {
	await executeTest("tofail-1-without-assists",
		{args: ["--kills", "1", "--deaths", "1", "--duration", "20"]},
		gamestats,
		terminal,
		async (terminal, result) => {
			console.log("'assists' argument was not provided, so a message about missing argument should be printed");
			await expect(terminal.getByText("assists", {full: true, strict: false})).toBeVisible({timeout: 200});
			result.asserts.required = true;
		})
});

test("scenario without duration", async ({terminal}) => {
	await executeTest("tofail-1-without-duration",
		{args: ["--kills", "1", "--deaths", "1", "--assists", "1"]},
		gamestats,
		terminal,
		async (terminal, result) => {
			console.log("'duration' argument was not provided, so a message about missing argument should be printed");
			await expect(terminal.getByText("duration", {full: true, strict: false})).toBeVisible({timeout: 200});
			result.asserts.required = true;
		})
});
