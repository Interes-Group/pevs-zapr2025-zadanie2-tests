import {defineConfig, Shell} from "@microsoft/tui-test";

export default defineConfig({
	retries: 0,
	trace: true,
	workers: 1,
	use: {shell: Shell.Bash, rows: 50}
});