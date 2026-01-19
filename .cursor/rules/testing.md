---
description: 'Test guidelines'
globs: **/*.test.ts
alwaysApply: true
---

# Examples of good/bad code

## describe names

If testing a specific class/method, and you want to use the name in the describe text, then use `MyClass`.

```ts
// BAD
describe('MyButton') {...}

// GOOD
describe(MyButton) {...}
```

## Correct signal type

`Signal` and `ReadonlySignal` are types for signals.

```ts
// BAD
const mySignal: ReturnType<typeof signal<UIElement | null>>;

// GOOD
const mySignal: Signal<UIElement | null>;
```

## Be strict with assertion if possible

```ts
// BAD
expect(something).toContain('abc');

// GOOD
expect(something).toBe('abc');
```

## Prefer more specific vitest helpers like `toHaveBeenCalledOnce()`

```ts
// BAD
expect(foo).toHaveBeenCalledTimes(1);

// GOOD
expect(foo).toHaveBeenCalledOnce();
```
