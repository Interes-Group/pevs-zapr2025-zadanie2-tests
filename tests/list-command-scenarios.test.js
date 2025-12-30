import {testScenario} from "../src/scenario-runner.js";
import {getExecutable} from "../src/utils.js";

const journal = getExecutable();

testScenario(journal, "no-args", {
	cmd: "list",
	args: {},
	clear: true,
	file: [
		["Hobbit", "J.R.R. Tolkien", "fantasy", "2022-01-01"],
	],
	expected: [
		["Hobbit", "J.R.R. Tolkien", "fantasy", "2022-01-01"],
	]
});

testScenario(journal, "filter-by-genre", {
	cmd: "list",
	args: {
		genre: "fantasy"
	},
	clear: true,
	file: [
		["Lord of the Ring", "J.R.R. Tolkien", "fantasy", "2022-01-01"],
		["Moby-Dick", "Herman Melville", "drama", "2020-06-12"],
	],
	expected: [
		["Lord of the Ring", "J.R.R. Tolkien", "fantasy", "2022-01-01"],
	]
});

testScenario(journal, "filter-by-score", {
	cmd: "list",
	args: {
		score: "3"
	},
	clear: true,
	file: [
		["Hobbit", "J.R.R. Tolkien", "fantasy", "2022-01-01"],
		["Moby-Dick", "Herman Melville", "drama", "2020-06-12", "", "4"],
	],
	expected: [
		["Moby-Dick", "Herman Melville", "drama", "2020-06-12", "4"],
	]
});

testScenario(journal, "filter-only-reading", {
	cmd: "list",
	args: {
		reading: null
	},
	clear: true,
	file: [
		["Lord of the Ring", "J.R.R. Tolkien", "fantasy", "2022-01-01", "2025-01-01"],
		["Moby-Dick", "Herman Melville", "drama", "2020-06-12"],
	],
	expected: [
		["Moby-Dick", "Herman Melville", "drama", "2020-06-12"],
	]
});

testScenario(journal, "filter-only-completed", {
	cmd: "list",
	args: {
		completed: null
	},
	clear: true,
	file: [
		["Lord of the Ring", "J.R.R. Tolkien", "fantasy", "2022-01-01", "2025-01-01"],
		["Moby-Dick", "Herman Melville", "drama", "2020-06-12"],
	],
	expected: [
		["Lord of the Ring", "J.R.R. Tolkien", "fantasy", "2022-01-01", "2025-01-01"],
	]
});

testScenario(journal, "empty", {
	cmd: "list",
	args: {},
	clear: true,
	file: [],
	expected: []
});