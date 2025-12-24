import { Button, Paragraph, renderList, signal, Stack, UIElement } from 'svev-frontend';
import { StopwatchModel } from './stopwatch/StopwatchModel';
import { StopwatchView } from './stopwatch/StopwatchView';
import { TodoModel } from './todo/TodoModel';
import { TodoView } from './todo/TodoView';

const app = document.querySelector<HTMLDivElement>('#app')!;

// Stopwatch app
const stopwatchModel = new StopwatchModel();
const stopwatchView = new StopwatchView(stopwatchModel);

// Todo app
const todoModel = new TodoModel();
const todoView = new TodoView(todoModel);

// Layout for the Stopwatch and Todo app
const layout = new Stack([stopwatchView, todoView]);
layout.direction('column');
layout.gap('100px');
layout.alignItems('center');

app.appendChild(layout.createUI());

// Dynamic list test. This demonstrates how one can render a dynamic list.
// It support adding, removing and shuffling elements in the list.
// The provided `map` function to `renderList` is only called when a new element must be created.
// `renderList` ensures the HTML DOM output matches the signal list.

function createIndexedElement(index: number): UIElement {
  const element = new Paragraph();
  element.text(`# ${index}`);
  return element;
}

const items = signal(
  Array.from({ length: 5 }).map((_, index) => {
    return createIndexedElement(index);
  })
);

const addToListButton = new Button();
addToListButton.label('+ Add to list');
addToListButton.onAction = () => {
  const oldItems = items.peek();
  const newItem = createIndexedElement(oldItems.length);
  items([...oldItems, newItem]);
};

app.appendChild(addToListButton.createUI());

renderList(app, items, (el) => el);
