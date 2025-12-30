import {test} from "@microsoft/tui-test";
import {assertAnyText, assertText} from "../src/assertions.js";
import {getTestName} from "../src/scenario-runner.js";
import {executeTest, getExecutable} from "../src/utils.js";

const journal = getExecutable()

const withoutNameConfig = {
	cmd: "new",
	args: {
		author: "J.R.R. Tolkien",
		genre: "fantasy",
		start: "2022-01-01"
	},
	clear: true
};
test(getTestName("fail-without-name", withoutNameConfig), async ({terminal}) => {
	await executeTest(
		"fail-without-name",
		withoutNameConfig,
		journal,
		terminal,
		async (terminal, result) => {
			console.log("name was not provided in argument so the new command should fail and error with 'missing name' message should be printer");
			await assertAnyText(terminal, ["name", "Name", "NAME"]);
			result.asserts.required = true;
		}
	);
});

const withoutAuthorConfig = {
	cmd: "new",
	args: {
		name: "Hobbit",
		genre: "fantasy",
		start: "2022-01-01"
	},
	clear: true
};
test(getTestName("fail-without-author", withoutAuthorConfig), async ({terminal}) => {
	await executeTest(
		"fail-without-author",
		withoutAuthorConfig,
		journal,
		terminal,
		async (terminal, result) => {
			console.log("author was not provided in argument so the new command should fail and error with 'missing author' message should be printer");
			await assertAnyText(terminal, ["author", "Author", "AUTHOR"]);
			result.asserts.required = true;
		}
	);
});

const withoutGenreConfig = {
	cmd: "new",
	args: {
		name: "Hobbit",
		author: "J.R.R. Tolkien",
		start: "2022-01-01"
	},
	clear: true
};
test(getTestName("fail-without-genre", withoutGenreConfig), async ({terminal}) => {
	await executeTest(
		"fail-without-genre",
		withoutGenreConfig,
		journal,
		terminal,
		async (terminal, result) => {
			console.log("genre was not provided in argument so the new command should fail and error with 'missing genre' message should be printer");
			await assertAnyText(terminal, ["genre", "Genre", "GENRE"]);
			result.asserts.required = true;
		}
	);
});

const withoutStartDateConfig = {
	cmd: "new",
	args: {
		name: "Hobbit",
		author: "J.R.R. Tolkien",
		genre: "fantasy",
	},
	clear: true
};
test(getTestName("fail-without-start", withoutStartDateConfig), async ({terminal}) => {
	await executeTest(
		"fail-without-start",
		withoutStartDateConfig,
		journal,
		terminal,
		async (terminal, result) => {
			console.log("start date was not provided in argument so the new command should fail and error with 'missing start date' message should be printer");
			await assertAnyText(terminal, ["start", "Start", "START", "date", "Date", "DATE"]);
			result.asserts.required = true;
		}
	);
});