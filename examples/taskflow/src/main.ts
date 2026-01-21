import './style.css';
import { KanbanCardModel } from './kanban/CardModel';
import { KanbanModel } from './kanban/Model';
import { KanbanView } from './kanban/View';
import { Flex } from 'svev-frontend';
import { User } from './users/User';

const kanbanModel = new KanbanModel();
const kanbanView = new KanbanView(kanbanModel);
populateExampleData(kanbanModel);

const app = new Flex().addClass('app').setChildren([kanbanView]);

app.render({ in: document.body });

function populateExampleData(kanbanModel: KanbanModel): void {
  const johnDoe = new User('John Doe', 'https://i.pravatar.cc/150?img=12');
  const janeDoe = new User('Jane Doe');

  kanbanModel
    .getColumn('todo')
    .addCard(new KanbanCardModel('Implement user authentication', 'high', johnDoe));
  kanbanModel.getColumn('todo').addCard(new KanbanCardModel('Finish the taskflow example', 'high'));
  kanbanModel
    .getColumn('inProgress')
    .addCard(new KanbanCardModel('Update documentation', 'medium', janeDoe));
  kanbanModel
    .getColumn('done')
    .addCard(new KanbanCardModel('Refactor legacy code', 'low', johnDoe));
  kanbanModel
    .getColumn('done')
    .addCard(
      new KanbanCardModel(
        'A task with unusual long title, which can be problematic due to its length, and can be truncated',
        'low',
        janeDoe
      )
    );
}
