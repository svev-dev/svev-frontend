import './style.css';
import { Button, Flex } from 'svev-frontend';
import { StopwatchModel } from './stopwatch/StopwatchModel';
import { StopwatchView } from './stopwatch/StopwatchView';
import { TodoModel } from './todo/TodoModel';
import { TodoView } from './todo/TodoView';
import { SelectTestView } from './form/SelectTestView';

// Stopwatch app
const stopwatchModel = new StopwatchModel();
const stopwatchView = new StopwatchView(stopwatchModel);

// Todo app
const todoModel = new TodoModel();
const todoView = new TodoView(todoModel);
const selectTest = new SelectTestView();

// Layout for the Stopwatch and Todo app
const layout = new Flex()
  .setChildren([stopwatchView, todoView, selectTest])
  .direction('column')
  .gap('25px')
  .alignItems('center');

const app = new Flex().setChildren([layout]).setCss({
  minHeight: '100vh',
  minWidth: '100vw',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
});

app.render({ in: document.body });

// Test garbage collection
{
  new Button();
}
