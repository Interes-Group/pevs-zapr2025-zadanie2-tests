import {testScenario} from "../src/scenario-runner.js";
import {getExecutable} from "../src/utils.js";

const journal = getExecutable()

testScenario(journal, "1-1 only-required", {
	cmd: "new",
	args: {
		name: "Hobbit",
		author: "J.R.R. Tolkien",
		genre: "fantasy",
		start: "2022-01-01"
	},
	clear: true
});

testScenario(journal, "1-2 with-score", {
	cmd: "new",
	args: {
		name: "Zaklínač",
		author: "Andrzej Sapkowski",
		genre: "fantasy",
		start: "2023-10-01",
		score: "3"
	},
	clear: true
});

testScenario(journal, "1-3 with-end", {
	cmd: "new",
	args: {
		name: "The Great Gatsby",
		author: "F. Scott Fitzgerald",
		genre: "fiction",
		start: "2024-05-25",
		end: "2024-09-01"
	},
	clear: true
});

testScenario(journal, "1-4 with-note", {
	cmd: "new",
	args: {
		name: "Moby-Dick",
		author: "Herman Melville",
		genre: "drama",
		start: "2020-06-12",
		note: "Hard to read for the first time"
	},
	clear: true
});

testScenario(journal, "1-5 all-optional-args", {
	cmd: "new",
	args: {
		name: "1984",
		author: "George Orwell",
		genre: "dystopian",
		start: "2024-01-10",
		end: "2024-01-20",
		score: "5",
		note: "Must read for everyone"
	},
	clear: true
});

testScenario(journal, "1-6 end-and-score", {
	cmd: "new",
	args: {
		name: "Dune",
		author: "Frank Herbert",
		genre: "sci-fi",
		start: "2023-08-15",
		end: "2023-09-10",
		score: "4"
	},
	clear: true
});

testScenario(journal, "1-7 end-and-note", {
	cmd: "new",
	args: {
		name: "Foundation",
		author: "Isaac Asimov",
		genre: "sci-fi",
		start: "2024-02-01",
		end: "2024-03-01",
		note: "Classic world-building"
	},
	clear: true
});

testScenario(journal, "1-8 score-and-note", {
	cmd: "new",
	args: {
		name: "Crime and Punishment",
		author: "Fyodor Dostoevsky",
		genre: "philosophical",
		start: "2021-11-20",
		score: "5",
		note: "Very deep and psychological"
	},
	clear: true
});
