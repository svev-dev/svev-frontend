import { Paragraph, Tabs, UIElement } from 'svev-frontend';
import { StylingStory } from './StylingStory';

export class TabsStory extends StylingStory {
  protected createElements(): UIElement[] {
    const tabs = new Tabs();

    for (let i = 1; i <= 5; i++) {
      tabs
        .addTab()
        .label(`Tab ${i}`)
        .setChild(new Paragraph().text(`This is the content of Tab ${i}`));
    }
    return [tabs];
  }
}
