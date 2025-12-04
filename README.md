# PEVŠ ZAPR 2025 - Tests for "Semestrálne Zadanie 1"

This repository contains automated tests for Assignment 1 from the ZAPR (Fundamentals of Procedural Programming) course.
The tests are designed to verify the correct implementation of the `gamestats` console application.

## Prerequisites

- **Node.js** <=20 : Node.js environment is required to run the tests.

## Installation

1. Download or clone this repository.
2. Open a terminal in the project root directory.
3. Install dependencies with the following command:

```bash
npm install
```

## Running Tests

The tests are implemented using the `@microsoft/tui-test` package and verify the behavior of the application in a text
user interface (TUI/CLI).

To run all tests, use the command:

```bash
npm test
```

The tests verify:

- Help output display.
- Required scenarios (point calculations, averages).
- Optional scenarios.
- Error states and input validation.

## Project Structure

- **`bin/gamestats`**: Executable file of the tested application (or reference script).
- **`src/`**: Helper scripts for tests.
    - `program-calculations.js`: Logic for verifying calculations (points, averages).
    - `utils.js`: Utility helpers.
    - `test-project.js`: Test project utilities.
- **`tests/`**: Test definition files.
    - `print-help.test.js`: Tests for the `--help` flag.
    - `scenarios-required.test.js`: Core test scenarios.
    - `scenarios-optional.test.js`: Extended scenarios.
    - `scenarios-to-fail.test.js`: Tests for invalid inputs and errors.
- **`tui-test.config.js`**: Testing framework configuration.
- **`results/`**: Test results output directory.
- **`tui-traces/`**: TUI interaction traces.

## Troubleshooting

If tests fail due to compatibility issues (Windows vs Linux/macOS), ensure that you have the correct paths and
permissions set for executing the binary in the `bin` directory.

## Additional Information

The test suite uses snapshot testing to verify consistent output. Snapshots are stored in the `tests/__snapshots__/`
directory.
