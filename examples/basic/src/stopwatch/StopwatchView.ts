import { Flex, UIElement, Button, Text, Element } from 'svev-frontend';
import { StopwatchModel } from './StopwatchModel';

export class StopwatchView extends UIElement {
  readonly #model: StopwatchModel;

  public constructor(model: StopwatchModel) {
    super();
    this.#model = model;
  }

  protected createUI(): Element {
    const duration = new Text();
    this.effect(() => {
      duration.text(StopwatchModel.format(this.#model.currentTime()));
    });

    const startButton = new Button()
      .label('Start')
      .variant('primary')
      .shortcut({ altOrOption: true, code: 'KeyS' })
      .setOnInvoke(this.#model.start);

    const stopButton = new Button()
      .label('Stop')
      .variant('primary')
      .shortcut({ altOrOption: true, code: 'KeyS' })
      .setOnInvoke(this.#model.stop);

    const resetButton = new Button()
      .label('Reset')
      .variant('secondary')
      .setOnInvoke(this.#model.reset);

    this.effect(() => {
      const currentTime = this.#model.currentTime();
      const isRunning = this.#model.isRunning();
      startButton.isEnabled(!isRunning);
      stopButton.isEnabled(isRunning);
      resetButton.isEnabled(currentTime !== 0);
    });

    const buttonFlex = new Flex()
      .setChildren([startButton, stopButton, resetButton])
      .direction('row')
      .gap('8px');

    const layout = this.createElement(() => new Flex().setChildren([duration, buttonFlex]))
      .direction('column')
      .alignItems('center');
    return layout;
  }
}
