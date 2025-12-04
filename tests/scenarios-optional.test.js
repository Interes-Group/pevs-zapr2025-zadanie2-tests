import {Shell, test} from "@microsoft/tui-test";
import {getExecutable, testScenario} from "../src/utils.js";

const gamestats = getExecutable()

test.use({shell: Shell.Bash, rows: 20});

testScenario(gamestats, "optional-1-mvp", {
	kills: 30,
	deaths: 5,
	assists: 20,
	duration: 40,
	mvp: true
});

testScenario(gamestats, "optional-2-headshots", {
	kills: 25,
	deaths: 10,
	assists: 15,
	duration: 35,
	headshots: 18
});

testScenario(gamestats, "optional-3-headshots-mvp", {
	kills: 5,
	deaths: 1,
	assists: 5,
	duration: 30,
	headshots: 4,
	mvp: true
});

testScenario(gamestats, "optional-4-teamkills", {
	kills: 20,
	deaths: 8,
	assists: 12,
	duration: 30,
	teamkills: 2,
});

testScenario(gamestats, "optional-5-teamkills-mvp", {
	kills: 20,
	deaths: 8,
	assists: 12,
	duration: 30,
	teamkills: 2,
	mvp: true
});

testScenario(gamestats, "optional-6-teamkills-headshots", {
	kills: 20,
	deaths: 8,
	assists: 12,
	duration: 30,
	headshots: 15,
	teamkills: 2,
});

testScenario(gamestats, "optional-7-full-args", {
	kills: 20,
	deaths: 8,
	assists: 12,
	duration: 30,
	headshots: 15,
	teamkills: 2,
	mvp: true
});