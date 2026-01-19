---
description: 'Guidelines for creating elements (UIElement) in the svev-frontend framework'
alwaysApply: false
---

# UIElement Creation

## Overview

This project uses a custom UIElement framework for building reactive UI components. UIElements extends `UIElement` either directly or indirectly. For elements that have a dynamic set of children, one can extend from `Container`. However, if you need multiple dynamic children set, then use `Fragment` directly.

See @UIElement.ts, @Container.ts and @Fragment.ts.

## Base Classes

### UIElement

- Base class for all UI components
- Provides: `id`, `isVisible`, `isEnabled`, styling, rendering, disposal

**CRITICAL**: Never duplicate properties that already exist in the base class:

- ❌ **Don't** create `disabled`, `isDisabled`, `visible`, `isVisible`, `enabled` properties
- ✅ **Do** use the base class properties: `isEnabled()`, `isVisible()`
- ✅ **Do** use `!this.isEnabled()` when you need the disabled state
- ✅ **Do** use `this.isEnabled(false)` to disable an element

Example of what NOT to do:

```ts
// ❌ WRONG - don't create isDisabled when isEnabled exists
public readonly isDisabled = this.prop(false);
const disabled = this.isDisabled() || !this.isEnabled();
```

Example of what TO do:

```ts
// ✅ CORRECT - use the base class isEnabled
const isDisabled = !this.isEnabled();
// To disable: element.isEnabled(false)
```

## Component Structure

### 1. Class Declaration

```ts
export class MyElement extends UIElement {
  // or
export class MyElement extends Container {
  // or extend from another UIElement
```

### 2. Properties

- Use `this.prop<T>(defaultValue)` to create reactive properties
- Example:

```ts
public readonly label = this.prop('');
public readonly size = this.prop<Size>('md');
public readonly variant = this.prop<Variant | undefined>(undefined);
public readonly icon = this.prop<SVGElement | undefined>(undefined);
```

Private reactive states, doesn't need to use `this.prop` at all. Prefer using `signal`. Example:

```ts
readonly #counter = signal(0);
```

The reasoning for this is that chaining isn't an important feature here.

### 3. Private State

- Use private fields with `#` prefix for internal state
- Example: `#onInvoke?: VoidFunction;`

### 4. `createUI()` Method

- Must be implemented if you extend from `UIElement` directly, or if you going to modify how the ancestor class renders.
- Returns `Element` (single) or `readonly Element[]` (multiple)
- `Element` = `UIElement | ChildNode`
- Create DOM elements and set up reactive effects here

**Refactoring for Readability**: If `createUI()` becomes long (>50 lines) or has deep nesting (>3 levels), extract helper methods:

```ts
// ✅ GOOD - extract helper methods
protected createUI(): Element {
  const element = document.createElement('div');
  let child: HTMLElement | undefined;

  this.effect(() => {
    child = this.#getOrCreateChild(element, child);
    this.#updateChild(child);
    this.#updateState(element);
  });

  return element;
}

#getOrCreateChild(parent: HTMLElement, existing: HTMLElement | undefined): HTMLElement {
  // Implementation
}

#updateChild(child: HTMLElement): void {
  // Implementation
}
```

Example:

```ts
protected createUI(): Element {
  const element = document.createElement('div');

  this.effect(() => {
    // Reactive updates based on properties
    element.textContent = this.label();
    element.className = this.buildClasses();
  });

  return element;
}
```

One can return other UIElements like this:

```ts
protected createUI(): Element {
  const title = document.createElement('h1');
  const text = document.createElement('p');

  this.effect(() => {
    // Reactive updates based on properties
    title.textContent = this.title();
    text.textContent = this.label();
  });

  // Flex is a UIElement (extends from Container)
  return new Flex().setChildren([title, text]);
}
```

Sometimes, you want to render an UIElement inside `createUI`. Example:

```ts
protected createUI(): Element {
  // We assume we have the private field #fragment which is a UIElement

  const title = document.createElement('h1');
  const layout = document.createElement('div');

  // The render method supports the following placements:
  // 1. { in: Node } -> renders the element within the DOM Node
  // 1. { before: Element } -> renders the element before the Element
  // 1. { after: Element } -> renders the element after the Element
  const unrender = this.#fragment.render({ in: layout });

  // We need to call `addDisposable` with the `unrender` method here because:
  // 1. We need to clean up
  // 2. #fragment can only be rendered once at the same time. Calling `createUI` again will cause #fragment to render twice -> exception.

  // By using `addDisposable` with `unrender` within `createUI`, we ensure `unrender` is called in these scenarios:
  // 1. When this UIElement is unrendered
  // 2. When this UIElement rerenders
  // 3. When this UIElement disposes.
  this.addDisposable(unrender);

  return [title, layout];
}
```

If you use the same property within an effect multiple times, then it can be better to refactor it out to a variable once, and consume the variable:

```ts
// BAD
this.effect(() => {
  if (!this.isEnabled()) {
    // ...
  }

  if (this.isEnabled()) {
    // ...
  }
});

// GOOD
this.effect(() => {
  const isEnabled = this.isEnabled();
  if (!isEnabled) {
    // ...
  }

  if (isEnabled) {
    // ...
  }
});
```

### 5. Reactive Updates

- Use `this.effect(() => { ... })` for reactive updates
- Effects automatically dispose when component is unrendered/rerendered/disposed
- Access properties with `()`: `this.label()`, `this.size()`
- Effects run when any accessed property changes

**Effect Cleanup Functions**: You can return a cleanup function from `this.effect()` (similar to React's `useEffect`). The cleanup function will automatically run before the effect re-runs or when the effect is disposed:

```ts
// ❌ BAD - manually calling dispose before each run
this.effect(() => {
  submenuDispose?.(); // Manual cleanup
  if (submenu) {
    const dispose = submenu.render({ in: li });
    submenuDispose = dispose;
  }
});

// ✅ GOOD - return cleanup function for automatic disposal
this.effect(() => {
  if (submenu) {
    const dispose = submenu.render({ in: li });
    return dispose; // Cleanup runs automatically before next effect run or when effect is disposed
  }

  // If we return a function (as we do above), then we can get the typescript error `Not all code paths return a value.`. Therefore, we return a dummy function here:
  return (): void => {};
});
```

**Note**: You don't need to call `this.addDisposable(dispose)` when returning a cleanup function from an effect. The effect system automatically handles calling the cleanup function when the effect is disposed or re-runs.

This pattern is especially useful when you need to clean up resources (like unrendering UIElements) before the effect re-runs.

### 6. Invokable

Elements like a button is invokable, and should implement the interface IInvokable. Instead of using the term `onclick` (which is UI specific), we instead talk about invoking. As we don't care if the button was clicked, was invoked due to a shortcut or other methods.

Example:

```ts
class Button extends UIElement {
  #onInvoke?: VoidFunction;

  protected createUI(): Element {
    const htmlButton = document.createElement('button');
    htmlButton.onclick = this.invoke;
  }

  public setOnInvoke = (fn: VoidFunction): this => {
    this.#onInvoke = fn;
    return this;
  };

  public invoke = (): void => {
    this.#onInvoke?.();
  };
}
```

### 7. Property Registration (Dev Mode)

- Implement `registerProperties()` for development tooling
- Only register in dev mode: `if (IS_DEV) { ... }`
- Call `super.registerProperties(register)` first
- Use appropriate register methods:
  - `register.addHeader('ComponentName')`
  - `register.addString('Label', this.label)`
  - `register.addOptions('Size', this.size, Sizes)`
  - `register.addOptionalOptions('Variant', this.variant, Variants)`
  - `register.addOptionalIcon('Icon', this.icon)`
  - `register.addOptionalShortcut('Shortcut', this.shortcut)`

See @IPropertyRegister.ts

Example:

```ts
public override registerProperties(register: IPropertyRegister): void {
  if (IS_DEV) {
    // super.registerProperties(register); will register properties defined in ancestor classes
    super.registerProperties(register);
    register.addHeader('Button');
    register.addOptions('Size', this.size, Sizes);
    register.addOptionalOptions('Variant', this.variant, Variants);
    register.addString('Label', this.label);
    register.addOptionalIcon('Icon', this.icon);
    register.addOptionalShortcut('Shortcut', this.shortcut);
  }
}
```

### 8. Disposal

- `this.addDisposable(dispose)` is used to register disposables. But it behaves differently depending on the scenario:
  1. If called inside `this.createUI`, `dispose` will be invoked if the UIElement gets disposed, rerenders, or gets unrendered
  2. Otherwise, `dispose` will be invoked when UIElement gets disposed.
- `this.effect(fn)` creates a signal effect and register its dispose method with `this.addDisposable`
- Use `this.addDisposable(dispose)` for manual cleanup

### 9. Code Quality

**Documentation**: Add JSDoc comments to private helper methods for better maintainability:

```ts
/**
 * Gets or creates a child element, reusing existing if available.
 * @param parent - The parent element to append to
 * @param existing - An existing element to reuse, if any
 * @returns The element (either existing or newly created)
 */
#getOrCreateChild(parent: HTMLElement, existing: HTMLElement | undefined): HTMLElement {
  // Implementation
}
```

**Component Ownership**: When a component should own/manage a DOM element internally (like a MenuItem owning its `<a>` tag), create it internally rather than requiring children. This simplifies the API for consumers.

## Common Patterns

### Simple Component (no children)

```ts
export class MyComponent extends UIElement {
  public readonly label = this.prop('');

  protected createUI(): Element {
    const element = document.createElement('div');
    this.effect(() => {
      element.textContent = this.label();
    });
    return element;
  }

  public override registerProperties(register: IPropertyRegister): void {
    if (IS_DEV) {
      super.registerProperties(register);
      register.addHeader('MyComponent');
      register.addString('Label', this.label);
    }
  }
}
```

### Component with Children

```ts
export class MyContainer extends Container {
  protected createUI(): Element {
    const container = document.createElement('div');
    const dispose = this.fragment.render({ in: container });
    this.addDisposable(dispose);
    return container;
  }
}
```

### Component with Click Handler

```ts
export class MyButton extends UIElement implements IInvokable {
  #onInvoke?: VoidFunction;

  protected createUI(): Element {
    const button = document.createElement('button');
    button.onclick = this.invoke;
    return button;
  }

  public setOnInvoke(fn: VoidFunction): this {
    this.#onInvoke = fn;
    return this;
  }

  public invoke = (): void => {
    this.#onInvoke?.();
  };
}
```

### Component with Dynamic Classes

```ts
this.effect(() => {
  const classNames = ['base-class'];
  if (this.isActive()) {
    classNames.push('active-class');
  }
  classNames.push(getSizeClass('component', this.size()));
  element.className = classNames.join(' ');
});
```

### Rerendering if top-level elements gets added/removed

```ts
this.effect(() => {
  const title = document.createElement('h1');

  // Setup an effect to cause rerender when this.#count changes.
  // We need a rerender as we need to change elements being rendered, and we can't change them from within `this.createUI`.
  let firstRun = true;
  this.effect(() => {
    this.#count(); // Listen to the count signal
    if (firstRun) {
      // No need to rerender on first run
      firstRun = false;
      return;
    }
    // This causes `this.createUI` to run again, and swaps out old elements with new ones.
    this.rerender();
  });

  // We render a button if `#count` is even, otherwise plain text

  if (this.#count() % 2 === 0) {
    const button = new Button().setOnInvoke(this.increaseCount);
    return [title, button];
  }

  const text = new Text().text(`${this.#count}`);
  return [title, text];
});
```

## Testing

**Rendering is Synchronous**: When you call `element.render(placement)`, the rendering happens immediately and synchronously. There is no need to wait or use `setTimeout` in tests. You can assert on the DOM immediately after calling `render()`:

```ts
// ✅ CORRECT - rendering is immediate
it('should render content', () => {
  const element = new MyElement().label('Test');
  const container = document.createElement('div');
  element.render({ in: container });

  expect(container.textContent).toBe('Test');
});

// ❌ WRONG - no need to wait
it('should render content', async () => {
  const element = new MyElement().label('Test');
  const container = document.createElement('div');
  element.render({ in: container });

  await new Promise((resolve) => setTimeout(resolve, 10));
  expect(container.textContent).toBe('Test');
});
```

When navigation or state changes trigger re-renders (via `rerender()`), those updates also happen synchronously within the same execution context. Effects run synchronously when signals change, so you can assert immediately after triggering the change.
