import type { UIElement } from 'svev-frontend';
import { Menu } from 'svev-daisyui';
import { StylingStory } from '../base/StylingStory';

export class MenuStory extends StylingStory {
  protected createElements(): UIElement[] {
    const element = new Menu();
    return [element];
  }
}
