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

    const startButton = new Button();
    startButton.label('Start');
    startButton.onAction = this._model.start;
    startButton.shortcut({ altOrOption: true, code: 'KeyS' });

    const stopButton = new Button();
    stopButton.label('Stop');
    stopButton.onAction = this._model.stop;
    stopButton.shortcut({ altOrOption: true, code: 'KeyS' });

    const resetButton = new Button();
    resetButton.label('Reset');
    resetButton.onAction = this._model.reset;

    this.effect(() => {
      const currentTime = this._model.currentTime();
      const isRunning = this._model.isRunning();
      startButton.isEnabled(!isRunning);
      stopButton.isEnabled(isRunning);
      resetButton.isEnabled(currentTime !== 0);
    });

    const buttonStack = new Stack([startButton, stopButton, resetButton]);
    buttonStack.direction('row');
    buttonStack.gap('8px');

    const layout = this.createElement(() => new Stack([duration, buttonStack]));
    layout.direction('column');
    layout.alignItems('center');
    return layout.createUI();
  }
}
