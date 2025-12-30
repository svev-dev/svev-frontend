import { Stack, UIElement, Button, Text, effect } from 'svev-frontend';
import { StopwatchModel } from './StopwatchModel';

export class StopwatchView extends UIElement {
  private _model: StopwatchModel;

  public constructor(model: StopwatchModel) {
    super();
    this._model = model;
  }

  public createUI(): HTMLElement {
    const duration = new Text();
    effect(() => {
      duration.text(StopwatchModel.format(this._model.currentTime()));
    });

    const startButton = new Button();
    startButton.label('Start');
    startButton.onAction = () => {
      this._model.start();
    };

    const stopButton = new Button();
    stopButton.label('Stop');
    stopButton.onAction = () => {
      this._model.stop();
    };

    const resetButton = new Button();
    resetButton.label('Reset');
    resetButton.onAction = () => {
      this._model.reset();
    };

    effect(() => {
      const isRunning = this._model.isRunning();
      startButton.isEnabled(!isRunning);
      stopButton.isEnabled(isRunning);
    });

    const buttonStack = new Stack([startButton, stopButton, resetButton]);
    buttonStack.direction('row');
    buttonStack.gap('8px');

    const layout = new Stack([duration, buttonStack]);
    layout.direction('column');
    layout.alignItems('center');

    return layout.createUI();
  }
}
