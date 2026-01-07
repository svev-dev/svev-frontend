import { BoolInput, UIElement } from 'svev-frontend';
import { StylingStory } from './StylingStory';

export class BoolInputStory extends StylingStory {
  protected createElements(): UIElement[] {
    const element = new BoolInput().label('My boolInput');
    return [element];
  }
}
