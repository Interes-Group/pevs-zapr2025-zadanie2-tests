import {test} from "@microsoft/tui-test";
import {assertAnyText} from "../src/assertions.js";
import {executeTest, getExecutable, getInitConfig} from "../src/utils.js";

const journal = getExecutable();

test("should print help", async ({terminal}) => {
	const config = getInitConfig();
	config.args.help = null;
	await executeTest(
		"print help",
		config,
		journal,
		terminal,
		async (terminal, result) => {
			await assertAnyText(terminal, ["help", "Help", "HELP"]);
			result.asserts.required = true;
		});
});