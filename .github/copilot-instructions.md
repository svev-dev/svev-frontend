# svev-frontend AI Coding Guide

## Project Overview

This is a TypeScript monorepo for building reactive UI components using a custom UIElement framework with signals. The project wraps Preact signals and provides two core packages:

- `packages/core/` - Reactive UI framework with signals, routing, and base elements
- `packages/daisyui/` - DaisyUI component wrappers using the core framework
- `examples/` - Example applications (basic, stories, taskflow)

**Key Architecture**: Uses npm workspaces. Core package exports TypeScript source directly for hot-reload during development (no build step needed).

## UIElement Framework Patterns

### Creating Components

All UI components extend `UIElement`, `Container`, or `Fragment`:

- **UIElement** - Base for all components. Provides `id`, `isVisible`, `isEnabled`, styling, rendering, disposal
- **Container** - Extends UIElement, manages a single dynamic set of children via internal `Fragment`
- **Fragment** - For multiple dynamic children sets

```ts
export class MyComponent extends Container {
  // Reactive properties - use this.prop<T>(default)
  public readonly label = this.prop('');
  public readonly size = this.prop<Size>('md');

  // Private state - use signal() directly, NOT this.prop
  readonly #counter = signal(0);

  protected createUI(): Element {
    const element = document.createElement('div');

    // Reactive effects
    this.effect(() => {
      element.textContent = this.label();
      element.className = this.#buildClasses();
    });

    return element;
  }
}
```

**CRITICAL - Base Class Properties**: NEVER duplicate these existing base properties:

- ❌ DON'T create `disabled`, `isDisabled`, `visible`, `enabled`
- ✅ DO use `this.isEnabled()` / `this.isEnabled(false)` / `!this.isEnabled()`
- ✅ DO use `this.isVisible()` / `this.isVisible(false)`

### Property vs Signal

- **`this.prop<T>()`** - For public/reactive component properties. Supports chaining: `button.label('Click').size('lg')`
- **`signal<T>()`** - For private internal state. Simpler, no chaining needed

### Rendering UIElements Inside createUI

```ts
protected createUI(): Element {
  const layout = document.createElement('div');

  // Render UIElement into DOM node
  const unrender = this.#fragment.render({ in: layout });

  // CRITICAL: Must dispose on cleanup/rerender
  this.addDisposable(unrender);

  return layout;
}
```

## Signals and Reactivity

Based on Preact signals with custom wrapper:

```ts
import { signal, effect, computed, batch, untracked } from 'svev-frontend';

const count = signal(0); // Create signal
const doubled = computed(() => count() * 2); // Computed value
effect(() => console.log(count())); // Auto-runs on changes

count(5); // Set value
const value = count(); // Read value (tracks dependency)
const peek = count.peek(); // Read without tracking
```

## DaisyUI Component Conventions

See `.cursor/rules/daisyui-elements.md` for details. Key points:

1. **Reference docs**: Include `// https://daisyui.com/components/button/` at top
2. **List all class names**: For Tailwind detection in comments
3. **Use Enums.ts**: Import common enums (`Size`, `Variant`, `Direction`) from `./Enums`, NOT local enums
4. **Helper functions**: Use `getSizeClass()`, `getVariantClass()`, `getDirectionClass()` from Enums.ts
5. **Export**: Add to `packages/daisyui/src/index.ts`

```ts
// https://daisyui.com/components/button/
// btn btn-primary btn-secondary btn-xs btn-sm btn-md btn-lg

import { getSizeClass, getVariantClass, type Size, type Variant } from './Enums';

export class Button extends UIElement {
  public readonly variant = this.prop<Variant | undefined>(undefined);
  public readonly size = this.prop<Size>('md');

  protected createUI(): Element {
    const btn = document.createElement('button');
    this.effect(() => {
      const classes = ['btn'];
      classes.push(getVariantClass('btn', this.variant()));
      classes.push(getSizeClass('btn', this.size()));
      btn.className = classes.filter(Boolean).join(' ');
    });
    return btn;
  }
}
```

## Routing

Built-in router with support for static routes, parameters, wildcards, subrouters, and layouts:

```ts
import { Router, BrowserNavigator, Slot } from 'svev-frontend';

const router = new Router(new BrowserNavigator())
  .add('/', () => new Text().text('Home'))
  .add('/users/:userId', (params) => new Text().text(() => `User: ${params().userId}`))
  .add('/files/*', () => new FileViewer()); // Wildcard

// Subrouter (must use wildcard pattern)
const userRouter = new Router(navigator).add('/profile', () => new Profile());
mainRouter.add('/users/*', userRouter);

// Layout wrapper
const layout = (slot: Slot) => new Flex().setChildren([new Header(), slot, new Footer()]);
const router = new Router(navigator, layout);
```

## Development Workflow

```bash
# Root commands (runs across all workspaces)
npm test                  # Run all tests
npm run test:coverage     # With coverage
npm run lint              # No warnings allowed
npm run format            # Check formatting
npm run typecheck         # Strict TS checking

# Run example apps
cd examples/basic && npm run dev
cd examples/stories && npm run dev
cd examples/taskflow && npm run dev

# E2E tests (Playwright)
cd examples/basic && npm run e2e-test
```

**Test files**: Use `*.test.ts` extension, co-located with source files.

**Engines**: Requires Node.js >=24.0.0, npm >=11.7.0

## Code Style Conventions

From `.cursor/rules/coding-convention.md`:

- **Optional calls**: Use `fn?.()` instead of `if (fn) fn()`
- **Void returns**: Use `return;` not `return undefined;`
- **Types**: Use `VoidFunction` not `() => void`
- **Disposal**: Use `Dispose` type for cleanup functions
- **Access modifiers**: Always use `public`/`protected`/`#private`
- **Method order**: public → protected → private
- **Early returns**: Apply in functions and loops (return/throw/yield/break/continue)
- **DRY**: Extract common code, reuse where possible

## Testing Conventions

From `.cursor/rules/testing.md`:

```ts
// ✅ Use class/function reference in describe
describe(MyButton, () => {});

// ✅ Prefer specific matchers
expect(foo).toHaveBeenCalledOnce();
expect(value).toBe('exact');

// ✅ Correct signal types
const mySignal: Signal<UIElement | null>;
const readonly: ReadonlySignal<string>;
```

## File Locations

- Core framework: `packages/core/src/`
  - Elements: `elements/UIElement.ts`, `elements/Container.ts`, `elements/Fragment.ts`
  - Signals: `signals/signals.ts`
  - Routing: `router/Router.ts`, `router/Slot.ts`
  - Navigation: `navigator/BrowserNavigator.ts`, `navigator/TestNavigator.ts`
- DaisyUI wrappers: `packages/daisyui/src/`
  - Common enums: `Enums.ts` (Size, Variant, Direction)
  - Components: `Button.ts`, `Modal.ts`, `StringInput.ts`, etc.
- Examples: `examples/basic/`, `examples/stories/`, `examples/taskflow/`

## Key Files to Reference

- [packages/core/src/elements/UIElement.ts](packages/core/src/elements/UIElement.ts) - Base component class
- [packages/core/src/elements/Property.ts](packages/core/src/elements/Property.ts) - Property pattern implementation
- [packages/core/src/signals/signals.ts](packages/core/src/signals/signals.ts) - Signal system
- [packages/daisyui/src/Enums.ts](packages/daisyui/src/Enums.ts) - Common DaisyUI enums and helpers
- [examples/basic/src/todo/TodoView.ts](examples/basic/src/todo/TodoView.ts) - Complete example component
