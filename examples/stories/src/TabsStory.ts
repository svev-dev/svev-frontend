import type { UIElement } from 'svev-frontend';
import { Paragraph } from 'svev-frontend';
import { StylingStory } from './StylingStory';
import { Tabs } from 'svev-daisyui';

export class TabsStory extends StylingStory {
  protected createElements(): UIElement[] {
    const tabs = new Tabs();

    for (let i = 0; i <= 3; i++) {
      tabs
        .addTab()
        .label(`Tab ${i}`)
        .setChild(new Paragraph().text(`This is the content of Tab ${i}`));
    }
    return [tabs];
  }
}
