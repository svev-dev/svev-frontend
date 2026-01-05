import { Stack, UIElement } from 'svev-frontend';
import { BaseStory } from './BaseStory';
import { Styling } from './Styling';

export abstract class StylingStory extends BaseStory {
  public override createUI(): ChildNode {
    const elements = this.createElements();
    const styling = new Styling();

    if (elements.length === 0) {
      throw new Error('createElements must return at least one element');
    }

    const stylingElement = elements[0];
    stylingElement?.registerProperties(styling);

    const layout = this.createElement(() => new Stack([styling, ...elements]))
      .direction('row')
      .gap('8px');
    return layout.createUI();
  }

  protected abstract createElements(): UIElement[];
}
