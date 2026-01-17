import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { RouterView } from './RouterView';
import { Text, Container } from 'svev-frontend';

describe('RouterView', () => {
  let container: HTMLElement;
  let routerView: RouterView;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    routerView = new RouterView();
  });

  afterEach(() => {
    if (container.parentNode) {
      document.body.removeChild(container);
    }
  });

  it('should render nothing initially', () => {
    routerView.render({ in: container });
    expect(container.textContent).toBe('');
  });

  it('should render content when set', async () => {
    routerView.render({ in: container });
    const content = new Text('Test Content');
    routerView.setContent(content);

    // Wait for effect to run
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(container.textContent).toContain('Test Content');
  });

  it('should update content when changed', async () => {
    routerView.render({ in: container });
    const content1 = new Text('Content 1');
    const content2 = new Text('Content 2');

    routerView.setContent(content1);
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(container.textContent).toContain('Content 1');

    routerView.setContent(content2);
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(container.textContent).toContain('Content 2');
    expect(container.textContent).not.toContain('Content 1');
  });

  it('should clear content when set to null', async () => {
    routerView.render({ in: container });
    const content = new Text('Test Content');
    routerView.setContent(content);

    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(container.textContent).toContain('Test Content');

    routerView.setContent(null);
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(container.textContent).toBe('');
  });

  it('should get content signal', () => {
    const signal = routerView.getContentSignal();
    expect(signal()).toBeNull();

    const content = new Text('Test');
    routerView.setContent(content);
    expect(signal()).toBe(content);
  });

  it('should work with complex UIElement', async () => {
    routerView.render({ in: container });
    const complexContent = new Container().setChildren([
      new Text('Header'),
      new Text('Body'),
      new Text('Footer'),
    ]);

    routerView.setContent(complexContent);
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(container.textContent).toContain('Header');
    expect(container.textContent).toContain('Body');
    expect(container.textContent).toContain('Footer');
  });

  it('should handle rapid content changes', async () => {
    routerView.render({ in: container });

    for (let i = 0; i < 10; i++) {
      routerView.setContent(new Text(`Content ${i}`));
    }

    await new Promise((resolve) => setTimeout(resolve, 10));
    // Should eventually show the last content
    expect(container.textContent).toContain('Content 9');
  });
});
