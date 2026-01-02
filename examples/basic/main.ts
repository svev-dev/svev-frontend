import { Stack } from 'svev-frontend';
import { StopwatchModel } from './stopwatch/StopwatchModel';
import { StopwatchView } from './stopwatch/StopwatchView';
import { TodoModel } from './todo/TodoModel';
import { TodoView } from './todo/TodoView';
import { CheckboxView } from './form/CheckboxView';

const app = document.querySelector<HTMLDivElement>('#app')!;

// Stopwatch app
const stopwatchModel = new StopwatchModel();
const stopwatchView = new StopwatchView(stopwatchModel);

// Todo app
const todoModel = new TodoModel();
const todoView = new TodoView(todoModel);
const checkboxView = new CheckboxView();

// Layout for the Stopwatch and Todo app
const layout = new Stack([stopwatchView, todoView, checkboxView]);
layout.direction('column');
layout.gap('100px');
layout.alignItems('center');

app.appendChild(layout.createUI());
