import { describe, it, expect, vi, Mock, beforeEach } from 'vitest';
import { UIElement } from './UIElement';

describe(UIElement, () => {
  it('should have a unique id', () => {
    const ids = new Set<string>();
    for (let i = 0; i < 1_000; ++i) {
      const element = new TestUIElement();
      ids.add(element.id());
    }
    expect(ids.size).toBe(1_000);
  });

  it('should be visible by default', () => {
    const element = new TestUIElement();
    expect(element.isVisible()).toBe(true);
  });

  it('should be enabled by default', () => {
    const element = new TestUIElement();
    expect(element.isEnabled()).toBe(true);
  });

  describe('render', () => {
    let childNode: HTMLElement;
    let parentNode: HTMLElement;
    let childFn: Mock<() => HTMLElement>;

    beforeEach(() => {
      childNode = document.createElement('div');
      parentNode = document.createElement('div');
      childFn = vi.fn(() => childNode);
    });

    it('should render the element to the parent node', () => {
      // Arrange
      const element = new TestUIElement(childFn);
      // Act
      element.render(parentNode);
      // Assert
      expect(parentNode.firstChild).toBe(childNode);
      expect(parentNode.childNodes).toHaveLength(1);
    });

    it('should remove element on render dispose', () => {
      // Arrange
      const element = new TestUIElement(childFn);
      const dispose = element.render(parentNode);
      // Act
      dispose();
      // Assert
      expect(parentNode.firstChild).toBeNull();
    });

    it('should call dispose when render dispose is called', () => {
      // Arrange
      const element = new TestUIElement(childFn);
      const myDispose = vi.fn();
      element.setOnDispose(myDispose);
      const dispose = element.render(parentNode);
      // Act
      expect(myDispose).not.toHaveBeenCalled();
      dispose();
      // Assert
      expect(myDispose).toHaveBeenCalledOnce();
    });

    it('should create element once', () => {
      // Arrange
      const element = new TestUIElement(childFn);
      // Act
      element.render(parentNode);
      // Assert
      expect(childFn).toHaveBeenCalledOnce();
    });

    it('should fail two simultaneous renders', () => {
      // Arrange
      const element = new TestUIElement(childFn);
      // Act
      element.render(parentNode);
      // Assert
      expect(() => element.render(parentNode)).toThrow();
    });

    it('should succeed two sequential renders', () => {
      // Arrange
      const element = new TestUIElement(childFn);
      const dispose = element.render(parentNode);
      // Act
      dispose();
      // Assert
      expect(() => element.render(parentNode)).not.toThrow();
    });

    it('should replace node on rerender', () => {
      // Arrange
      const element = new TestUIElement(childFn);
      element.render(parentNode);
      // Act
      const newChildNode = document.createElement('span');
      childFn.mockReturnValue(newChildNode);
      element.forceRerender();
      // Assert
      expect(parentNode.firstChild).toBe(newChildNode);
      expect(parentNode.childNodes).toHaveLength(1);
      expect(childFn).toHaveBeenCalledTimes(2);
    });

    describe('isVisible', () => {
      it('should hide element when made invisible', () => {
        // Arrange
        const element = new TestUIElement(childFn);
        element.render(parentNode);
        expect(parentNode.firstChild).toBe(childNode);
        // Act
        element.isVisible(false);
        // Assert
        expect(parentNode.firstChild).instanceOf(Comment);
        expect(parentNode.childNodes).toHaveLength(1);
        expect(childFn).toHaveBeenCalledOnce();
      });

      it('should not call createUI when invisible', () => {
        // Arrange
        const element = new TestUIElement(childFn);
        element.isVisible(false);
        // Act
        element.render(parentNode);
        // Assert
        expect(parentNode.firstChild).instanceOf(Comment);
        expect(parentNode.childNodes).toHaveLength(1);
        expect(childFn).not.toHaveBeenCalled();
      });

      it.each([true, false])(
        'should call dispose when element visibility toggles from %s',
        (visible: boolean) => {
          // Arrange
          const myDispose = vi.fn();
          const element = new TestUIElement(childFn);
          element.setOnDispose(myDispose);
          element.isVisible(visible);
          element.render(parentNode);
          // Act
          expect(myDispose).not.toHaveBeenCalled();
          element.isVisible(!visible);
          // Assert
          expect(myDispose).toHaveBeenCalledOnce();
        }
      );
    });
  });
});

class TestUIElement extends UIElement {
  readonly #nodeCreator: () => ChildNode;

  public constructor(nodeCreator?: () => ChildNode) {
    super();
    this.#nodeCreator = nodeCreator ?? ((): ChildNode => document.createElement('div'));
  }

  public override createUI(): ChildNode {
    return this.#nodeCreator();
  }

  public setOnDispose(fn: VoidFunction): void {
    this.addDisposable(fn);
  }

  public forceRerender(): void {
    this.rerender();
  }
}
