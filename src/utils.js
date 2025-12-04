import {expect, test} from "@microsoft/tui-test";
import * as fs from "node:fs";
import * as path from "node:path";
import {program} from "./program-calculations.js";

export function getExecutable() {
	const binDir = process.env.BIN_DIR || path.join(".","bin");
	return path.join(binDir, "gamestats");
}

export function getRunCmd(gamestats, kills, deaths, assists, duration, headshots, team, mvp) {
	let cmd = gamestats + " ";
	cmd += "--kills " + kills + " ";
	cmd += "--deaths " + deaths + " ";
	cmd += "--assists " + assists + " ";
	cmd += "--duration " + duration + " ";
	if (headshots && headshots > 0) cmd += "--headshots " + headshots + " ";
	if (team && team > 0) cmd += "--teamkills " + team + " ";
	if (!!mvp) cmd += "--mvp ";
	return cmd;
}

export function writeTestResult(scenarioName, results) {
	const dir = process.env.RESULT_DIR || "results";
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, {recursive: true});
	}
	fs.writeFileSync(path.join(dir, "test-scenario-" + scenarioName + ".json"), JSON.stringify(results, null, 2));
}

export function getInitTestResults(scenarioName, config) {
	return {
		scenario: scenarioName,
		config: config,
		expected: {},
		asserts: {
			required: false,
		}
	};
}

async function assertText(terminal, text = "") {
	try {
		await expect(terminal.getByText(text, {strict: false})).toBeVisible({timeout: 500});
		return true;
	} catch (e) {
		//console.error("assertion for: ", text, " has failed");
		return false;
	}
}

async function assertAnyText(terminal, texts = []) {
	for (const text of texts) {
		const assertValue = await assertText(terminal, text);
		if (assertValue) return true;
	}
	return false;
}

async function assertNameAndValue(terminal, name, values = []) {
	const assertName = await assertText(terminal, name);
	if (!assertName) return false;
	return await assertAnyText(terminal, values);
}

function getAllNumberChecks(value) {
	return [
		value.toFixed(2),
		value.toFixed(1),
		Math.trunc(value).toString(),
		Math.round(value).toString()
	]
}

export function assert(terminal) {
	return {
		kills: async (kills) => await assertNameAndValue(terminal, "Kills", [kills]),
		deaths: async (deaths) => await assertNameAndValue(terminal, "Deaths", [deaths]),
		assists: async (assists) => await assertNameAndValue(terminal, "Assists", [assists]),
		duration: async (duration) => await assertNameAndValue(terminal, "Duration", [duration + " min.", duration + "min.", duration + "min", duration + " min"]),
		headshots: async (headshots) => await assertNameAndValue(terminal, "Headshots", [headshots]),
		teamkills: async (teamkills) => await assertNameAndValue(terminal, "Team Kills", [teamkills]),
		mvp: async () => await assertText(terminal, "MVP"),
		kd: async (kd) => await assertNameAndValue(terminal, "K/D", getAllNumberChecks(kd)),
		kda: async (kda) => await assertNameAndValue(terminal, "KDA", getAllNumberChecks(kda)),
		kpm: async (kpm) => await assertNameAndValue(terminal, "KPM", getAllNumberChecks(kpm)),
		apm: async (apm) => await assertNameAndValue(terminal, "APM", getAllNumberChecks(apm)),
		performance: async (score) => {
			let asserted = false;
			asserted = await assertText(terminal, "Performance");
			if (!asserted) return false;
			asserted = await assertAnyText(terminal, ["/100", "/ 100", " /100", " / 100"]);
			if (!asserted) return false;
			asserted = await assertAnyText(terminal, getAllNumberChecks(score));
			return asserted;
		},
		rank: async (rank) => {
			let asserted = await assertText(terminal, "Rank");
			if (!asserted) return false;
			return await assertText(terminal, rank);
		}
	};
}

export async function assertRequired(terminal, kills, deaths, assists, duration) {
	let asserted = false;
	asserted = await assert(terminal).kills(kills);
	if (!asserted) return false;
	asserted = await assert(terminal).deaths(deaths);
	if (!asserted) return false;
	asserted = await assert(terminal).assists(assists);
	if (!asserted) return false;
	asserted = await assert(terminal).duration(duration);
	return asserted;
}

export async function executeTest(scenarioName, scenarioConfig, gamestatsExec, terminal, testFunction) {
	const result = getInitTestResults(scenarioName, scenarioConfig);
	let cmd = "";
	if (!scenarioConfig.args || scenarioConfig.args.length === 0) {
		cmd = getRunCmd(gamestatsExec, scenarioConfig.kills, scenarioConfig.deaths, scenarioConfig.assists, scenarioConfig.duration, scenarioConfig.headshots, scenarioConfig.teamkills, scenarioConfig.mvp);
	} else {
		cmd = gamestatsExec + " " + scenarioConfig.args.join(" ");
	}
	console.log("executing: ", cmd);
	try {
		terminal.submit(cmd);
		await testFunction(terminal, result);
	} finally {
		await expect(terminal).toMatchSnapshot();
		writeTestResult(scenarioName, result);
	}
}

export function testScenario(gamestats, scenarioName, config) {
	let testName = "scenario " + scenarioName + " ::";
	testName += " k:" + config.kills;
	testName += " d:" + config.deaths;
	testName += " a:" + config.assists;
	testName += " du:" + config.duration;
	if (!!config.headshots) testName += " h:" + config.headshots;
	if (!!config.teamkills) testName += " t:" + config.teamkills;
	if (!!config.mvp) testName += " mvp";

	var checkpointTime = new Date().getTime();

	test(testName, async ({terminal}) => { // TODO handle test timeouts
		await executeTest(
			scenarioName,
			config,
			gamestats,
			terminal,
			async (terminal, result) => {
				result.asserts.required = await assertRequired(terminal, config.kills, config.deaths, config.assists, config.duration);
				// console.log("REQUIRED TIME CHECKPOINT DURATION", new Date().getTime() - checkpointTime);
				// checkpointTime = new Date().getTime();
				if (!!config.headshots) {
					console.log("expected headshots: ", config.headshots);
					result.asserts.headshots = await assert(terminal).headshots(config.headshots);
					// console.log("HEADSHOTS TIME CHECKPOINT DURATION", new Date().getTime() - checkpointTime);
					// checkpointTime = new Date().getTime();
				}

				if (!!config.teamkills) {
					console.log("expected teamkills: ", config.teamkills);
					result.asserts.teamkills = await assert(terminal).teamkills(config.teamkills);
					// console.log("TEAMKILLS TIME CHECKPOINT DURATION", new Date().getTime() - checkpointTime);
					// checkpointTime = new Date().getTime();
				}

				if (!!config.mvp) {
					console.log("expected mvp");
					result.asserts.mvp = await assert(terminal).mvp();
					// console.log("MVP TIME CHECKPOINT DURATION", new Date().getTime() - checkpointTime);
					// checkpointTime = new Date().getTime();
				}

				const kd = program.kd(config.kills, config.deaths);
				console.log("expected k/d: ", kd);
				result.expected.kd = kd.toFixed(2);
				result.asserts.kd = await assert(terminal).kd(kd);
				// console.log("KD TIME CHECKPOINT DURATION", new Date().getTime() - checkpointTime);
				// checkpointTime = new Date().getTime();

				const kda = program.kda(config.kills, config.assists, config.deaths);
				console.log("expected kda: ", kda);
				result.expected.kda = kda.toFixed(2);
				result.asserts.kda = await assert(terminal).kda(kda);
				// console.log("KDA TIME CHECKPOINT DURATION", new Date().getTime() - checkpointTime);
				// checkpointTime = new Date().getTime();

				const kpm = program.kpm(config.kills, config.duration);
				console.log("expected kpm: ", kpm);
				result.expected.kpm = kpm.toFixed(2);
				result.asserts.kpm = await assert(terminal).kpm(kpm);
				// console.log("KPM TIME CHECKPOINT DURATION", new Date().getTime() - checkpointTime);
				// checkpointTime = new Date().getTime();

				const apm = program.apm(config.kills, config.assists, config.duration);
				console.log("expected apm: ", apm);
				result.expected.apm = apm.toFixed(2);
				result.asserts.apm = await assert(terminal).apm(apm);
				// console.log("APM TIME CHECKPOINT DURATION", new Date().getTime() - checkpointTime);
				// checkpointTime = new Date().getTime();

				const score = program.score(config.kills, config.deaths, config.assists, config.duration, config.headshots, config.teamkills, config.mvp);
				console.log("expected score: ", score);
				result.expected.performance = score.toFixed(2);
				result.asserts.performance = await assert(terminal).performance(score);
				// console.log("SCORE TIME CHECKPOINT DURATION", new Date().getTime() - checkpointTime);
				// checkpointTime = new Date().getTime();

				const rank = program.rank(score);
				console.log("expected rank: ", rank);
				result.expected.rank = rank;
				result.asserts.rank = await assert(terminal).rank(rank);
				// console.log("RANK TIME CHECKPOINT DURATION", new Date().getTime() - checkpointTime);
				// checkpointTime = new Date().getTime();

				if (Object.values(result.asserts).some(v => !v)) {
					const errorMessage = "some asserts failed: [" + Object.keys(result.asserts).filter(k => !result.asserts[k]).join(", ") + "]";
					console.info(errorMessage);
					throw new Error(errorMessage);
				}
			}
		);
	});
}