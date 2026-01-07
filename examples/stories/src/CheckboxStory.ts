import { Checkbox, UIElement } from 'svev-frontend';
import { StylingStory } from './StylingStory';

export class CheckboxStory extends StylingStory {
  protected createElements(): UIElement[] {
    const element = new Checkbox().label('My checkbox');
    return [element];
  }
}
