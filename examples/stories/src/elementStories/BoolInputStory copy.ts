import type { UIElement } from 'svev-frontend';
import { BoolInput } from 'svev-daisyui';
import { StylingStory } from '../base/StylingStory';

export class MenuStory extends StylingStory {
  protected createElements(): UIElement[] {
    const element = new Menu().label('My menu');
    return [element];
  }
}
