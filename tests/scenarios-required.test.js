import {Shell, test} from "@microsoft/tui-test";
import {getExecutable, testScenario} from "../src/utils.js";

const gamestats = getExecutable()

test.use({shell: Shell.Bash, rows: 20});

testScenario(gamestats, "required-1", {
	kills: 7,
	deaths: 4,
	assists: 10,
	duration: 35
});

testScenario(gamestats, "required-2", {
	kills: 25,
	deaths: 10,
	assists: 15,
	duration: 35
});

testScenario(gamestats, "required-3", {
	kills: 1,
	deaths: 1,
	assists: 1,
	duration: 10
});

testScenario(gamestats, "required-4", {
	kills: 0,
	deaths: 15,
	assists: 1,
	duration: 20
});

testScenario(gamestats, "required-5", {
	kills: 1,
	deaths: 0,
	assists: 25,
	duration: 25
});

testScenario(gamestats, "required-6", {
	kills: 1,
	deaths: 1,
	assists: 0,
	duration: 25
});

testScenario(gamestats, "required-7", {
	kills: 1,
	deaths: 1,
	assists: 1,
	duration: 0
});