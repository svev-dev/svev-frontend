import './style.css';
import { Flex, Text, createSVGElement } from 'svev-frontend';
import { StopwatchModel } from './stopwatch/StopwatchModel';
import { StopwatchView } from './stopwatch/StopwatchView';
import { TodoModel } from './todo/TodoModel';
import { TodoView } from './todo/TodoView';
import { SelectTestView } from './form/SelectTestView';
import { Button, Card, Menu, MenuItem, Modal } from 'svev-daisyui';

// Stopwatch app
const stopwatchModel = new StopwatchModel();
const stopwatchView = new StopwatchView(stopwatchModel);

// Todo app
const todoModel = new TodoModel();
const todoView = new TodoView(todoModel);
const selectTest = new SelectTestView();

// Card examples
const basicCard = new Card()
  .title('Basic Card')
  .description('This is a simple card with a title, description, and action buttons.')
  .setChildren([new Button().label('Action').variant('primary'), new Button().label('Cancel')]);

const cardWithImage = new Card()
  .title('Card with Image')
  .description('This card includes an image. You can use any image URL.')
  .imageSrc('https://picsum.photos/400/200')
  .imageAlt('Random image')
  .isSide(true)
  .setChildren([new Button().label('View Details').variant('primary')]);

const largeCard = new Card()
  .title('Large Card')
  .description('This is a large-sized card (card-lg). Perfect for showcasing important content.')
  .size('lg')
  .setChildren([
    new Button().label('Primary Action').variant('primary'),
    new Button().label('Secondary'),
  ]);

const compactCard = new Card()
  .title('Compact Card')
  .description('A compact card with reduced padding.')
  .isCompact(true)
  .setChildren([new Button().label('Compact Action').size('sm')]);

const borderedCard = new Card()
  .title('Bordered Card')
  .description('This card has a border. The default is bordered.')
  .isBordered(true)
  .setChildren([new Button().label('Action')]);

const dashedCard = new Card()
  .title('Dashed Border Card')
  .description('This card has a dashed border instead of solid.')
  .isBordered(true)
  .isDashed(true)
  .setChildren([new Button().label('Action')]);

// Menu examples
const basicMenu = new Menu().setChildren([
  new MenuItem().label('Home').href('/home'),
  new MenuItem().label('About').href('/about'),
  new MenuItem().label('Contact').href('/contact'),
]);

const menuWithStates = new Menu().setChildren([
  new MenuItem().isTitle(true).label('Navigation'),
  new MenuItem().isActive(true).label('Dashboard').href('/dashboard'),
  new MenuItem().label('Settings').href('/settings'),
  new MenuItem().isEnabled(false).label('Disabled Item').href('/disabled'),
  new MenuItem().label('Logout').href('/logout'),
]);

const horizontalMenu = new Menu()
  .direction('horizontal')
  .setChildren([
    new MenuItem().label('Home').href('/home'),
    new MenuItem().label('Products').href('/products'),
    new MenuItem().label('About').href('/about'),
    new MenuItem().label('Contact').href('/contact'),
  ]);

const largeMenu = new Menu()
  .size('lg')
  .setChildren([
    new MenuItem().isTitle(true).label('Large Menu'),
    new MenuItem().label('Item 1').href('/item1'),
    new MenuItem().label('Item 2').href('/item2'),
    new MenuItem().label('Item 3').href('/item3'),
  ]);

const smallMenu = new Menu()
  .size('sm')
  .setChildren([
    new MenuItem().label('Compact 1').href('/compact1'),
    new MenuItem().label('Compact 2').href('/compact2'),
    new MenuItem().label('Compact 3').href('/compact3'),
  ]);

const menuWithSubmenu = new Menu().setChildren([
  new MenuItem().label('Home').href('/home'),
  new MenuItem()
    .label('Products')
    .href('/products')
    .setSubmenu(
      new Menu().setChildren([
        new MenuItem().label('Design').href('/products/design'),
        new MenuItem().label('Development').href('/products/development'),
        new MenuItem().label('Hosting').href('/products/hosting'),
      ])
    ),
  new MenuItem().label('About').href('/about'),
]);

// Create simple SVG icons for menu
const homeIcon = createSVGElement(
  '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>'
);
const settingsIcon = createSVGElement(
  '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>'
);
const userIcon = createSVGElement(
  '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>'
);
const mailIcon = createSVGElement(
  '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>'
);

const menuWithIcons = new Menu().setChildren([
  new MenuItem().label('Home').href('/home').icon(homeIcon),
  new MenuItem().label('Settings').href('/settings').icon(settingsIcon),
  new MenuItem().label('Profile').href('/profile').icon(userIcon),
  new MenuItem().label('Messages').href('/messages').icon(mailIcon),
]);

const menuWithTitleParent = new Menu().setChildren([
  new MenuItem()
    .isTitle(true)
    .label('Title')
    .setSubmenu(
      new Menu().setChildren([
        new MenuItem().label('Item 1').href('/item1'),
        new MenuItem().label('Item 2').href('/item2'),
        new MenuItem().label('Item 3').href('/item3'),
      ])
    ),
]);

const menuWithFocused = new Menu().setChildren([
  new MenuItem().label('Home').href('/home'),
  new MenuItem().isFocused(true).label('Focused Item').href('/focused'),
  new MenuItem().label('About').href('/about'),
  new MenuItem().label('Contact').href('/contact'),
]);

// Menu examples container
const menuExamples = new Flex()
  .setChildren([
    new Flex().setChildren([basicMenu]),
    new Flex().setChildren([menuWithStates]),
    new Flex().setChildren([horizontalMenu]),
    new Flex().setChildren([largeMenu]),
    new Flex().setChildren([smallMenu]),
    new Flex().setChildren([menuWithSubmenu]),
    new Flex().setChildren([menuWithIcons]),
    new Flex().setChildren([menuWithTitleParent]),
    new Flex().setChildren([menuWithFocused]),
  ])
  .direction('row')
  .gap('20px')
  .addClass('group-examples');

// Card examples container
const cardExamples = new Flex()
  .setChildren([basicCard, cardWithImage, largeCard, compactCard, borderedCard, dashedCard])
  .direction('row')
  .gap('20px')
  .addClass('group-examples');

// Modal example
const modal = new Modal()
  .title('Modal title')
  .closeOnBackdrop(false)
  .closeOnEscape(true)
  .setChildren([
    new Text().text('This is a text inside the modal body. '),
    new Text().text('This is another text inside the modal body.'),
    new Flex()
      .setChildren([
        new Button()
          .label('Got it!')
          .variant('primary')
          .setOnInvoke(() => modal.close()),
        new Button().label('Close').setOnInvoke(() => modal.close()),
      ])
      .direction('row')
      .addClass('modal-footer'),
  ]);

modal.render({ in: document.body });

const modalButton = new Button()
  .label('Show Popup Message')
  .variant('primary')
  .setOnInvoke(() => modal.open());

// Layout for the Stopwatch and Todo app
const layout = new Flex()
  .setChildren([stopwatchView, todoView, modalButton, selectTest, cardExamples, menuExamples])
  .direction('column')
  .gap('25px')
  .alignItems('center');

const app = new Flex().setChildren([layout]).addClass('app');

app.render({ in: document.body });

// Test garbage collection
{
  new Button();
}
