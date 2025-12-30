import {test} from "@microsoft/tui-test";
import {assertAnyText} from "../src/assertions.js";
import {getTestName} from "../src/scenario-runner.js";
import {executeTest, getExecutable, getInitConfig} from "../src/utils.js";

const journal = getExecutable();

const config = getInitConfig();
config.args.help = null;
test(getTestName("print help", config), async ({terminal}) => {
	await executeTest(
		"0-0 print help",
		config,
		journal,
		terminal,
		async (terminal, result) => {
			await assertAnyText(terminal, ["help", "Help", "HELP"]);
			result.asserts.required = true;
		});
});