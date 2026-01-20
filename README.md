# svev-frontend

A TypeScript npm library with strict type checking, testing, and linting.

## Setup

```bash
npm install
```

## Development

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests in watch mode with coverage reporting
npm run test:coverage

# Type check
npm run typecheck

# Lint (no warnings allowed)
npm run lint
# Fix auto-fixable lint issues
npm run lint:fix

# Check code formatting
npm run format

# Fix code formatting
npm run format:fix

# Build
npm run build
```

## Project Structure

This is a monorepo using npm workspaces:

- `packages/core/` - Core library source code
- `examples/` - Example applications using the library
  - `basic/` - Basic example app
  - `stories/` - Storybook-style component showcase
  - `taskflow/` - TaskFlow example (Trello/Jira-like app)
- Test files use `*.test.ts` extension and live alongside production files

## Linting & Formatting

- **Linting**: Uses `eslint` with TypeScript ESLint and strict rules. Warnings are treated as errors.
- **Formatting**: Uses `prettier`. Auto-format on save is configured for VSCode/Cursor.
- **Type Checking**: Strict TypeScript configuration with all strict flags enabled.

### VSCode/Cursor Extensions

For the best experience, install these extensions:

- **ESLint** (`dbaeumer.vscode-eslint`) - For linting with eslint
- **Prettier** (`esbenp.prettier-vscode`) - For code formatting with prettier

## Example Apps

Example apps use npm workspaces to reference the core package as a local dependency. The core package exports TypeScript source files directly, enabling hot-reloading during development without requiring a build step.

To run an example:

```bash
# Basic example
cd examples/basic
npm run dev

# Stories (component showcase)
cd examples/stories
npm run dev

# TaskFlow example
cd examples/taskflow
npm run dev
```

All examples are configured to use the `svev-frontend` package from the workspace, which is automatically linked via npm workspaces.

## Install Node and Npm

Look in the package.json to see what version of node and npm you will need for this framework.
Here is some tips of how you can update them.

```bash
#Check version of npm
npm -v

#Update npm to latest version
npm install -g npm@latest

#List versions of node
nvm list

#Install a specific version of node
nvm install 24.0.0

#Set the specific version of node to used in this framework
nvm use 24.0.0
```
