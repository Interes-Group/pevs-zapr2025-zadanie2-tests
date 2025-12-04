import {expect, Shell, test} from "@microsoft/tui-test";
import {executeTest, getExecutable} from "../src/utils.js";

const gamestats = getExecutable();

test.use({shell: Shell.Bash, rows: 25});

test("should print help", async ({terminal}) => {
	await executeTest(
		"help",
		{args: ["--help"]},
		gamestats,
		terminal,
		async (terminal, result) => {
			await expect(terminal.getByText("Help", {full: true, strict: false})).toBeVisible({timeout: 200});
			result.asserts.required = true;
		});
});

test("should print rankings", async ({terminal}) => {
	await executeTest(
		"ranks",
		{args: ["--ranks"]},
		gamestats,
		terminal,
		async (terminal, result) => {
			await expect(terminal.getByText("Noob", {full: true, strict: false})).toBeVisible({timeout: 200});
			await expect(terminal.getByText("Iron", {full: true, strict: false})).toBeVisible({timeout: 200});
			await expect(terminal.getByText("Bronze", {full: true, strict: false})).toBeVisible({timeout: 200});
			await expect(terminal.getByText("Silver", {full: true, strict: false})).toBeVisible({timeout: 200});
			await expect(terminal.getByText("Gold", {full: true, strict: false})).toBeVisible({timeout: 200});
			await expect(terminal.getByText("Platinum", {full: true, strict: false})).toBeVisible({timeout: 200});
			await expect(terminal.getByText("Diamond", {full: true, strict: false})).toBeVisible({timeout: 200});
			await expect(terminal.getByText("Master", {full: true, strict: false})).toBeVisible({timeout: 200});
			await expect(terminal.getByText("Grandmaster", {full: true, strict: false})).toBeVisible({timeout: 200});
			await expect(terminal.getByText("Godlike", {full: true, strict: false})).toBeVisible({timeout: 200});
			result.asserts.required = true;
		}
	);
})