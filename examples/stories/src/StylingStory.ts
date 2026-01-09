import { Element, Flex, UIElement } from 'svev-frontend';
import { BaseStory } from './BaseStory';
import { Styling } from './Styling';

export abstract class StylingStory extends BaseStory {
  protected createUI(): Element[] {
    const elements = this.createElements();
    const styling = new Styling();

    if (elements.length === 0) {
      throw new Error('createElements must return at least one element');
    }

    const stylingElement = elements[0];
    stylingElement?.registerProperties(styling);

    const layout = this.createElement(() => new Flex([...elements, styling]))
      .direction('column')
      .gap('8px')
      .padding('8px');

    return [layout];
  }

  protected abstract createElements(): UIElement[];
}
