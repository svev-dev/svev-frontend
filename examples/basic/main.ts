import { Button, Modal, Stack } from 'svev-frontend';
import { StopwatchModel } from './stopwatch/StopwatchModel';
import { StopwatchView } from './stopwatch/StopwatchView';
import { TodoModel } from './todo/TodoModel';
import { TodoView } from './todo/TodoView';
import { createCheckboxTest } from './form/createCheckboxTest';

const app = document.querySelector<HTMLDivElement>('#app')!;

// Stopwatch app
const stopwatchModel = new StopwatchModel();
const stopwatchView = new StopwatchView(stopwatchModel);

// Todo app
const todoModel = new TodoModel();
const todoView = new TodoView(todoModel);
const checkboxTest = createCheckboxTest();

const startButton = new Button();
startButton.variant('primary');
startButton.label('Popup modal');
startButton.onAction = () => {
  //modal.show();
  modal.text('This is a modal dialog triggered by the "' + startButton.label() + '" button.');
};

const modal = new Modal();

const stack = new Stack([startButton, modal]);

// Layout for the Stopwatch and Todo app
const layout = new Stack([stopwatchView, stack, todoView, checkboxTest]);
layout.direction('column');
layout.gap('100px');
layout.alignItems('center');

app.appendChild(layout.createUI());
