import type { UIElement } from 'svev-frontend';
import { Button } from 'svev-daisyui';
import { StylingStory } from '../base/StylingStory';

export class ButtonStory extends StylingStory {
  protected createElements(): UIElement[] {
    const button = new Button().label('My button');
    return [button];
  }
}
