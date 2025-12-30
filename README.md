# PEVŠ ZAPR 2025 - Tests for "Semestrálne Zadanie 2"

This repository contains an automated test suite for the second assignment of the ZAPR (Fundamentals of Procedural
Programming) course. These tests verify the functionality of the `journal` console application using the
`@microsoft/tui-test` framework.

## 📋 Prerequisites

- **Node.js**: Version `<=20.x` is required.
- **Project Binary**: The tests expect your compiled `journal` executable to be located in the `bin/` directory.

## 🚀 Getting Started

1. **Clone or download** this repository into your project environment.
2. **Install dependencies** by running the following command in the root directory:
   ```bash
   npm install
   ```
3. **Prepare your binary**: Ensure your `journal` executable is in the `bin` folder and has execution permissions.

## 🛠️ Running Tests

You can run the tests using the following scripts defined in `package.json`:

### Run all TUI tests

This is the primary way to run the test suite using the Microsoft TUI Test runner:

```bash
npm run tui:test
```

### Run specific test logic

To run the custom scenario runner or project-specific validation:

```bash
npm run dir:test      # Runs index.js
npm run project:test  # Runs src/test-project.js
```

## 📂 Project Structure

- `bin/`: Location for your application executable (`journal`).
- `src/`: Core testing logic, including the scenario runner, utility functions, and custom assertions.
- `tests/`: Individual test files:
    - `print-help.test.js`: Verifies the help output.
    - `new-command-scenarios.test.js`: Tests valid "new" command entries.
    - `new-command-tofail-scenarios.test.js`: Validates error handling for incorrect inputs.
    - `list-command-scenarios.test.js`: Tests the listing of journal entries.
- `results/`: Directory where test execution results and JSON reports are generated.
- `tui-test.config.js`: Configuration file for the TUI test framework.

## 🔍 Troubleshooting

- **Permission Denied**: If the tests fail to run your binary, try granting execution permissions:
  `chmod +x bin/journal`.
- **Node Version**: If you encounter unexpected errors, verify your version with `node -v` (should be 20 or lower).
- **Snapshots**: If the output format changes intentionally, snapshots in the `tests/__snapshots__/` directory may need
  updating.

## 📄 License

This project is licensed under the Apache-2.0 License.

