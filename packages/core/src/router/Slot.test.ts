import { describe, it, expect, beforeEach } from 'vitest';
import { Slot } from './Slot';
import type { Signal } from '../signals/signals';
import { signal } from '../signals/signals';
import type { Element } from '../elements/UIElement';
import { UIElement } from '../elements/UIElement';
import { Fragment } from '../elements/Fragment';

describe(Slot, () => {
  let container: Node;
  let childSignal: Signal<UIElement | null>;
  let slot: Slot;

  beforeEach(() => {
    container = document.createElement('div');
    childSignal = signal(null);
    slot = new Slot(childSignal);
  });

  it('should render nothing initially', () => {
    slot.render({ in: container });
    expect(container.textContent).toBe('');

    // Verify DOM tree
    // We shouldn't render anything. Only allowing HTML comments.
    container.childNodes.forEach((child) => {
      expect(child instanceof Comment).toBe(true);
    });
  });

  it('should render content when signal is set', () => {
    slot.render({ in: container });
    const content = new TestElement('Test Content');
    childSignal(content);

    expect(container.textContent).toContain('Test Content');
  });

  it('should not render additional HTML elements (e.g. wrappers)', () => {
    slot.render({ in: container });
    const content = new TestElement('Test Content');
    childSignal(content);

    expect(container.childNodes.length).toBe(1);
    const childNode = container.firstChild;
    expect(childNode).toBeInstanceOf(Text);
  });

  it('should update content when signal changes', () => {
    slot.render({ in: container });
    const content1 = new TestElement('Content 1');
    const content2 = new TestElement('Content 2');

    childSignal(content1);
    expect(container.textContent).toBe('Content 1');

    childSignal(content2);
    expect(container.textContent).toBe('Content 2');
    expect(container.textContent).not.toBe('Content 1');
  });

  it('should clear content when signal is set to null', () => {
    slot.render({ in: container });
    const content = new TestElement('Test Content');
    childSignal(content);

    expect(container.textContent).toBe('Test Content');

    childSignal(null);
    expect(container.textContent).toBe('');
  });

  it('should work with complex UIElement', () => {
    slot.render({ in: container });
    const complexContent = new Fragment();
    complexContent.setChildren([
      new TestElement('Header'),
      new TestElement('Body'),
      new TestElement('Footer'),
    ]);

    childSignal(complexContent);
    expect(container.textContent).toContain('Header');
    expect(container.textContent).toContain('Body');
    expect(container.textContent).toContain('Footer');
  });

  it('should handle rapid content changes', () => {
    slot.render({ in: container });

    for (let i = 0; i < 10; i++) {
      childSignal(new TestElement(`Content ${i}`));
      expect(container.textContent).toContain(`Content ${i}`);
    }
  });
});

class TestElement extends UIElement {
  readonly #text: string;

  public constructor(text: string) {
    super();
    this.#text = text;
  }

  protected createUI(): Element | readonly Element[] {
    return document.createTextNode(this.#text);
  }
}
