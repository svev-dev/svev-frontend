import type { UIElement } from 'svev-frontend';
import { BoolInput } from 'svev-daisyui';
import { StylingStory } from '../base/StylingStory';

export class BoolInputStory extends StylingStory {
  protected createElements(): UIElement[] {
    const element = new BoolInput().label('My boolInput');
    return [element];
  }
}
