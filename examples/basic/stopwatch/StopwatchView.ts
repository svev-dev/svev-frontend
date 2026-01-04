import { Stack, UIElement, Button, Text } from 'svev-frontend';
import { StopwatchModel } from './StopwatchModel';

export class StopwatchView extends UIElement {
  private _model: StopwatchModel;

  public constructor(model: StopwatchModel) {
    super();
    this._model = model;
  }

  public createUI(): HTMLElement {
    const duration = new Text();
    this.effect(() => {
      duration.text(StopwatchModel.format(this._model.currentTime()));
    });

    const startButton = new Button()
      .label('Start')
      .variant('accent')
      .shortcut({ altOrOption: true, code: 'KeyS' })
      .setOnInvoke(this._model.start);

    const stopButton = new Button()
      .label('Stop')
      .variant('accent')
      .shortcut({ altOrOption: true, code: 'KeyS' })
      .setOnInvoke(this._model.stop);

    const resetButton = new Button()
      .label('Reset')
      .variant('secondary')
      .setOnInvoke(this._model.reset);

    this.effect(() => {
      const currentTime = this._model.currentTime();
      const isRunning = this._model.isRunning();
      startButton.isEnabled(!isRunning);
      stopButton.isEnabled(isRunning);
      resetButton.isEnabled(currentTime !== 0);
    });

    const buttonStack = new Stack([startButton, stopButton, resetButton])
      .direction('row')
      .gap('8px');

    const layout = this.createElement(() => new Stack([duration, buttonStack]))
      .direction('column')
      .alignItems('center');
    return layout.createUI();
  }
}
