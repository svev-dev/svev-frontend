import { StopwatchModel } from './stopwatch/StopwatchModel';
import { StopwatchView } from './stopwatch/StopwatchView';

const app = document.querySelector<HTMLDivElement>('#app')!;

const stopwatchModel = new StopwatchModel();
const stopwatchView = new StopwatchView(stopwatchModel);

app.appendChild(stopwatchView.createUI());
