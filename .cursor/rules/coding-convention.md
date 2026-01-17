---
description: 'General coding convention'
alwaysApply: true
---

# Clean code

We highly value clean code in this repository. That includes:

- Prefer short methods
- Don't nest too many levels
- Prefer `const` over `let`
- Use typescript
- Use typedoc for public/protected functions where it is useful
- Make the code understandable without comments (good variable names, break up complicated logic). And use comments if this isn't achievable.
- Class methods/fields should be sorted in the following order: public, protected, private.

## Examples

```ts
// BAD - don't check before calling optional functions
if (myFunction) {
  myFunction();
}

// GOOD - use optional chaining for optional function calls
myFunction?.();
```

**Always use optional chaining (`?.()`) instead of `if` checks when calling optional functions or methods.**

```ts
// BAD
return undefined;

// GOOD
return;
```

```ts
// BAD
type MyType = () => void;

// GOOD
type MyType = VoidFunction;
```

```ts
// BAD
const dispose: VoidFunction;

// GOOD
const dispose: Dispose; // common type we use many places
```
