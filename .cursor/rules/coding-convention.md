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
- Make the code understandable without comments (good variable names, break up complicated logic in a natural way). And use comments if this isn't achievable.
- Class methods/fields should be sorted in the following order: public, protected, private.
- Class methods/field should use access modifiers (public, protected or #).
- Keep same order of functions, method, variables in similar code
- Don't repeat yourself (apply the DRY principle). Reuse code or move common code into separate units.
- Be consistent in naming, name of the same thing should be the same.
- Apply early return by the keywords return, throw and yield.
- Apply early return in loops by the keywords break and continue.
- Solve the problem in a simple way. Don't over-engineer.
- Try to apply the Single Responsibility Principle
- Remove dead code

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
