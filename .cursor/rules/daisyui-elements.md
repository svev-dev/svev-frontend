---
description: 'Guidelines for converting DaisyUI components to UIElement in svev-daisyui'
globs: **/daisyui/**/*.ts
alwaysApply: false
---

# UIElement creation

Prerequisite: @ui-element-creation.md

See the documentation for DaisyUI here: @web https://daisyui.com/llms.txt

## Overview

We want to use the DaisyUI component, but convert them to our framework using UIElement. We need to be smart when deciding which properties/API to expose for each component. Too much flexibility can cause confusion. Think "How would the corresponding react/vue/svelte component's API look like?".

## 1. Connect to the DaisyUI docs

When creating an UIElement, you must refer back to the DaisyUI docs for the corresponding component. Like this:

```ts
// https://daisyui.com/components/button/

export class Button extends UIElement {...}
```

## 2. Tailwind Class Names

**CRITICAL**: All Tailwind/DaisyUI class names must appear in plain text comments so Tailwind can detect them.

```ts
// https://tailwindcss.com/docs/detecting-classes-in-source-files
// component-class-name
// component-variant-1 component-variant-2
// component-size-xs component-size-sm component-size-md component-size-lg component-size-xl
// component-modifier-1 component-modifier-2
```

List ALL possible class names that might be used, even if constructed dynamically.

You can add this between the DaisyUI doc reference and the class.

## 3. Enums

**IMPORTANT**: When creating a new enum, **always check if it should go in @Enums.ts first**.

### When to put enums in `Enums.ts`:

Put enums in `@Enums.ts` if they are:

- **Common/reusable** across multiple components (e.g., `Size`, `Variant`, `Direction`)
- **Generic concepts** that could be used by other DaisyUI components
- **Part of DaisyUI's standard patterns** (sizes, variants, directions, colors)

**Default to putting enums in `Enums.ts`** unless they are truly component-specific and unlikely to be reused.

### Pattern for enums in `Enums.ts`:

1. **Array of values** with `as const`
2. **Type** derived from the array
3. **Helper function** for generating class names (following the pattern of existing helpers)

When consuming an enum through helper functions like `getSizeClass` or similar, do this:

```ts
// GOOD
classNames.push(getDirectionClass('menu', this.direction()));

// BAD
const directionClass = getDirectionClass('menu', this.direction());
// No need to handle the special case `directionClass === ''` here.
if (directionClass) {
  classNames.push(directionClass);
}
```

Example:

```ts
// In Enums.ts
export const Sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
export type Size = (typeof Sizes)[number];

export function getSizeClass(className: string, size: Size): string {
  if (size === 'md') return ''; // md is often the default
  return `${className}-${size}`;
}
```

### Component-specific enums:

Only keep enums in the component file if they are:

- **Truly unique** to that component
- **Unlikely to be reused** by other components
- **Component-specific values** that don't follow a common pattern

When in doubt, **put it in `Enums.ts`** - it's easier to move it later than to refactor multiple components.

## 4. Export

We must export the new element in the @index.ts.

## DaisyUI Components

When creating DaisyUI components:

1. **Reference the DaisyUI docs**: Include link to component docs
2. **List all class names**: In comments for Tailwind detection
3. **Follow DaisyUI structure**: Use correct HTML structure and class names
4. **Support sizes**: Use `Size` enum and `getSizeClass()` helper from `@Enums.ts`
5. **Support variants**: Use `Variant` enum and `getVariantClass()` helper from `@Enums.ts` when applicable
6. **Support directions**: Use `Direction` enum and `getDirectionClass()` helper from `@Enums.ts` when applicable
7. **Use Enums.ts**: Always import common enums and their helpers from `./Enums` - never create local enums for common concepts
