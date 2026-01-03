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

- `src/` - Source code
- `examples/` - Example applications using the library
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

Example apps are configured to use the library source directly for hot-reloading during development. They use npm workspaces and Vite path aliases to import from `src/` directly.

To run an example:

```bash
cd examples/basic
npm run dev
```
