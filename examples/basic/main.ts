import { Stack } from 'svev-frontend';
import { StopwatchModel } from './stopwatch/StopwatchModel';
import { StopwatchView } from './stopwatch/StopwatchView';
import { TodoModel } from './todo/TodoModel';
import { TodoView } from './todo/TodoView';

const app = document.querySelector<HTMLDivElement>('#app')!;

const stopwatchModel = new StopwatchModel();
const stopwatchView = new StopwatchView(stopwatchModel);

const todoModel = new TodoModel();
const todoView = new TodoView(todoModel);

const layout = new Stack([stopwatchView, todoView]);
layout.direction('column');
layout.gap('100px');
layout.alignItems('center');

app.appendChild(layout.createUI());
