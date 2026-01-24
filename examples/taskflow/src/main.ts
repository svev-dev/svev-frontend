import './style.css';
import { CardModel } from './kanban/CardModel';
import { BoardModel } from './kanban/BoardModel';
import { BoardView } from './kanban/BoardView';
import { Flex } from 'svev-frontend';
import { User } from './users/User';

const kanbanModel = new BoardModel();
const kanbanView = new BoardView(kanbanModel);
populateExampleData(kanbanModel);

const app = new Flex().addClass('app').setChildren([kanbanView]);

app.render({ in: document.body });

function populateExampleData(kanbanModel: BoardModel): void {
  const johnDoe = new User('John Doe', 'https://i.pravatar.cc/150?img=12');
  const janeDoe = new User('Jane Doe');

  kanbanModel
    .getColumn('todo')
    .addCard(new CardModel('Implement user authentication', 'high', johnDoe));
  kanbanModel.getColumn('todo').addCard(new CardModel('Finish the taskflow example', 'high'));
  kanbanModel
    .getColumn('inProgress')
    .addCard(new CardModel('Update documentation', 'medium', janeDoe));
  kanbanModel.getColumn('done').addCard(new CardModel('Refactor legacy code', 'low', johnDoe));
  kanbanModel
    .getColumn('done')
    .addCard(
      new CardModel(
        'A task with unusual long title, which can be problematic due to its length, and can be truncated',
        'low',
        janeDoe
      )
    );
}
