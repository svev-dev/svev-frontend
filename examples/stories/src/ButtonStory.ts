import { Button, UIElement } from 'svev-frontend';
import { StylingStory } from './StylingStory';

export class ButtonStory extends StylingStory {
  protected createElements(): UIElement[] {
    const button = new Button().label('My button');
    return [button];
  }
}
