import type { Element } from 'svev-frontend';
import { Flex, UIElement, Text } from 'svev-frontend';
import { Button } from 'svev-daisyui';
import { StopwatchModel } from './StopwatchModel';

export class StopwatchView extends UIElement {
  readonly #model: StopwatchModel;

  public constructor(model: StopwatchModel) {
    super();
    this.#model = model;
  }

  protected createUI(): Element {
    const duration = new Text().text(() => StopwatchModel.format(this.#model.currentTime()));

    const startButton = new Button()
      .label('Start')
      .variant('primary')
      .shortcut({ altOrOption: true, code: 'KeyS' })
      .setOnInvoke(this.#model.start)
      .isEnabled(() => !this.#model.isRunning());

    const stopButton = new Button()
      .label('Stop')
      .variant('primary')
      .shortcut({ altOrOption: true, code: 'KeyS' })
      .setOnInvoke(this.#model.stop)
      .isEnabled(() => this.#model.isRunning());

    const resetButton = new Button()
      .label('Reset')
      .variant('secondary')
      .setOnInvoke(this.#model.reset)
      .isEnabled(() => this.#model.currentTime() !== 0);

    const buttonFlex = new Flex()
      .setChildren([startButton, stopButton, resetButton])
      .direction('row')
      .gap('8px');

    const layout = new Flex()
      .setChildren([duration, buttonFlex])
      .direction('column')
      .alignItems('center');
    return layout;
  }
}
