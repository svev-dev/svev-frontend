import './style.css';
import { Stack } from 'svev-frontend';
import { StopwatchModel } from './stopwatch/StopwatchModel';
import { StopwatchView } from './stopwatch/StopwatchView';
import { TodoModel } from './todo/TodoModel';
import { TodoView } from './todo/TodoView';
import { createCheckboxTest } from './form/createCheckboxTest';
import { createSelectTest } from './form/createSelectTest';

const app = document.querySelector<HTMLDivElement>('#app')!;

// Stopwatch app
const stopwatchModel = new StopwatchModel();
const stopwatchView = new StopwatchView(stopwatchModel);

// Todo app
const todoModel = new TodoModel();
const todoView = new TodoView(todoModel);
const checkboxTest = createCheckboxTest();
const selectTest = createSelectTest();

// Layout for the Stopwatch and Todo app
const layout = new Stack([stopwatchView, todoView, checkboxTest, selectTest])
  .direction('column')
  .gap('25px')
  .alignItems('center');

app.appendChild(layout.createUI());
