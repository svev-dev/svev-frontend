import './style.css';
import { Divider, Flex, Paragraph, Text, createSVGElement } from 'svev-frontend';
import { StopwatchModel } from './stopwatch/StopwatchModel';
import { StopwatchView } from './stopwatch/StopwatchView';
import { TodoModel } from './todo/TodoModel';
import { TodoView } from './todo/TodoView';
import { SelectTestView } from './form/SelectTestView';
import {
  Button,
  Card,
  CardActions,
  CardBody,
  CardImage,
  CardTitle,
  Dropdown,
  DropdownContent,
  Menu,
  MenuItem,
  Navbar,
  NavbarStart,
  NavbarCenter,
  NavbarEnd,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'svev-daisyui';

// Stopwatch app
const stopwatchModel = new StopwatchModel();
const stopwatchView = new StopwatchView(stopwatchModel);

// Todo app
const todoModel = new TodoModel();
const todoView = new TodoView(todoModel);
const selectTest = new SelectTestView();

// Card examples
const basicCard = new Card().addClass('w-96 bg-base-100 shadow-md');
{
  const title = new CardTitle().text('Basic Card');
  const actions = new CardActions().setChildren([
    new Button().label('Action').variant('primary'),
    new Button().label('Cancel'),
  ]);
  const body = new CardBody().setChildren([
    title,
    new Text().text('This is a simple card with a title, description, and action buttons.'),
    actions,
  ]);
  basicCard.setChildren([body]);
}

const cardWithImage = new Card().isSide(true);
{
  const image = new CardImage().src('https://picsum.photos/400/200').alt('Random image');
  const title = new CardTitle().text('Card with Image');
  const actions = new CardActions().setChildren([
    new Button().label('View Details').variant('primary'),
  ]);
  const body = new CardBody().setChildren([
    title,
    new Text().text('This card includes an image. You can use any image URL.'),
    actions,
  ]);
  cardWithImage.setChildren([image, body]);
}

const largeCard = new Card().size('lg');
{
  const title = new CardTitle().text('Large Card');
  const actions = new CardActions().setChildren([
    new Button().label('Primary Action').variant('primary'),
    new Button().label('Secondary'),
  ]);
  const body = new CardBody().setChildren([
    title,
    new Text().text(
      'This is a large-sized card (card-lg). Perfect for showcasing important content.'
    ),
    actions,
  ]);
  largeCard.setChildren([body]);
}

const compactCard = new Card().isCompact(true);
{
  const title = new CardTitle().text('Compact Card');
  const actions = new CardActions().setChildren([new Button().label('Compact Action').size('sm')]);
  const body = new CardBody().setChildren([
    title,
    new Text().text('A compact card with reduced padding.'),
    actions,
  ]);
  compactCard.setChildren([body]);
}

const borderedCard = new Card().isBordered(true);
{
  const title = new CardTitle().text('Bordered Card');
  const actions = new CardActions().setChildren([new Button().label('Action')]);
  const body = new CardBody().setChildren([
    title,
    new Text().text('This card has a border. The default is bordered.'),
    actions,
  ]);
  borderedCard.setChildren([body]);
}

const dashedCard = new Card().isBordered(true).isDashed(true);
{
  const title = new CardTitle().text('Dashed Border Card');
  const actions = new CardActions().setChildren([new Button().label('Action')]);
  const body = new CardBody().setChildren([
    title,
    new Text().text('This card has a dashed border instead of solid.'),
    actions,
  ]);
  dashedCard.setChildren([body]);
}

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

// Dropdown examples
const basicDropdown = new Dropdown().trigger(new Button().label('Click')).setChildren([
  new DropdownContent().addChild(
    new Menu()
      .size('sm')
      .addClass('bg-base-100 rounded-box z-1 w-52 p-2 shadow')
      .setChildren([
        new MenuItem().label('Item 1').href('/item1'),
        new MenuItem().label('Item 2').href('/item2'),
        new MenuItem().label('Item 3').href('/item3'),
      ])
  ),
]);

const dropdownWithHover = new Dropdown()
  .trigger(new Button().label('Hover me').variant('primary'))
  .toggleOnHover(true)
  .setChildren([
    new DropdownContent().addChild(
      new Menu()
        .size('sm')
        .addClass('bg-base-100 rounded-box z-1 w-52 p-2 shadow')
        .setChildren([
          new MenuItem().label('Homepage').href('/homepage'),
          new MenuItem().label('Portfolio').href('/portfolio'),
          new MenuItem().label('About').href('/about'),
        ])
    ),
  ]);

const dropdownStart = new Dropdown()
  .trigger(new Button().label('Start'))
  .horizontalPlacement('start')
  .setChildren([
    new DropdownContent().addChild(
      new Menu()
        .size('sm')
        .addClass('bg-base-100 rounded-box z-1 w-52 p-2 shadow')
        .setChildren([
          new MenuItem().label('Item 1').href('/item1'),
          new MenuItem().label('Item 2').href('/item2'),
        ])
    ),
  ]);

const dropdownEnd = new Dropdown()
  .trigger(new Button().label('End'))
  .horizontalPlacement('end')
  .setChildren([
    new DropdownContent().addChild(
      new Menu()
        .size('sm')
        .addClass('bg-base-100 rounded-box z-1 w-52 p-2 shadow')
        .setChildren([
          new MenuItem().label('Item 1').href('/item1'),
          new MenuItem().label('Item 2').href('/item2'),
        ])
    ),
  ]);

const dropdownTop = new Dropdown()
  .trigger(new Button().label('Top'))
  .verticalPlacement('top')
  .setChildren([
    new DropdownContent().addChild(
      new Menu()
        .size('sm')
        .addClass('bg-base-100 rounded-box z-1 w-52 p-2 shadow')
        .setChildren([
          new MenuItem().label('Item 1').href('/item1'),
          new MenuItem().label('Item 2').href('/item2'),
        ])
    ),
  ]);

const dropdownLeft = new Dropdown()
  .trigger(new Button().label('Left'))
  .verticalPlacement('left')
  .setChildren([
    new DropdownContent().addChild(
      new Menu()
        .size('sm')
        .addClass('bg-base-100 rounded-box z-1 w-52 p-2 shadow')
        .setChildren([
          new MenuItem().label('Item 1').href('/item1'),
          new MenuItem().label('Item 2').href('/item2'),
        ])
    ),
  ]);

const dropdownRight = new Dropdown()
  .trigger(new Button().label('Right'))
  .verticalPlacement('right')
  .setChildren([
    new DropdownContent().addChild(
      new Menu()
        .size('sm')
        .addClass('bg-base-100 rounded-box z-1 w-52 p-2 shadow')
        .setChildren([
          new MenuItem().label('Item 1').href('/item1'),
          new MenuItem().label('Item 2').href('/item2'),
        ])
    ),
  ]);

const dropdownWithLargeMenu = new Dropdown()
  .trigger(new Button().label('Large Menu').variant('secondary'))
  .setChildren([
    new DropdownContent().addChild(
      new Menu()
        .size('lg')
        .addClass('bg-base-100 rounded-box z-1 w-52 p-2 shadow')
        .setChildren([
          new MenuItem().label('Large Item 1').href('/item1'),
          new MenuItem().label('Large Item 2').href('/item2'),
          new MenuItem().label('Large Item 3').href('/item3'),
        ])
    ),
  ]);

// Navbar examples
const menuIcon = createSVGElement(
  '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>'
);
const hamburgerIcon = createSVGElement(
  '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>'
);
const searchIcon = createSVGElement(
  '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>'
);
const dropdownHamburgerIcon = createSVGElement(
  '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" /></svg>'
);

const basicNavbar = new Navbar()
  .addClass('bg-base-100 shadow-sm')
  .addChild(new Button().label('svev').addClass('btn-ghost text-xl'));

const navbarWithIcon = new Navbar()
  .addClass('bg-base-100 shadow-sm')
  .setChildren([
    new NavbarStart().addChild(new Button().label('daisyUI').addClass('btn-ghost text-xl')),
    new NavbarEnd().addChild(
      new Button().icon(menuIcon).addClass('btn-square btn-ghost').size('sm')
    ),
  ]);

const navbarWithStartCenterEnd = new Navbar()
  .addClass('bg-base-100 shadow-sm')
  .setChildren([
    new NavbarStart().addChild(
      new Button().icon(hamburgerIcon).addClass('btn-square btn-ghost').size('sm')
    ),
    new NavbarCenter().addChild(new Button().label('daisyUI').addClass('btn-ghost text-xl')),
    new NavbarEnd().addChild(
      new Button().icon(searchIcon).addClass('btn-square btn-ghost').size('sm')
    ),
  ]);

const navbarWithMenu = new Navbar()
  .addClass('bg-base-100 shadow-sm')
  .setChildren([
    new NavbarStart().addChild(new Button().label('daisyUI').addClass('btn-ghost text-xl')),
    new NavbarEnd().addChild(
      new Menu()
        .direction('horizontal')
        .setChildren([
          new MenuItem().label('Link').href('/link'),
          new MenuItem().label('Parent').href('/parent'),
        ])
    ),
  ]);

const navbarWithButtons = new Navbar().addClass('bg-base-100 shadow-sm').setChildren([
  new NavbarStart().addChild(new Button().label('Home').addClass('btn-ghost').size('sm')),
  new NavbarCenter().addChild(new Button().label('Logo').addClass('btn-ghost text-xl')),
  new NavbarEnd().addChild(
    new Flex()
      .setChildren([
        new Button().label('Login').variant('primary').size('sm'),
        new Button().label('Sign Up').variant('secondary').size('sm'),
      ])
      .direction('row')
      .gap('8px')
  ),
]);

const navbarWithColors = new Navbar()
  .addClass('bg-primary text-primary-content')
  .addChild(
    new NavbarStart().addChild(new Button().label('daisyUI').addClass('btn-ghost text-xl'))
  );

const navbarWithDropdown = new Navbar().addClass('bg-base-100 shadow-sm').setChildren([
  new NavbarStart().addChild(
    new Dropdown()
      .trigger(new Button().icon(dropdownHamburgerIcon).addClass('btn-ghost btn-circle').size('sm'))
      .setChildren([
        new DropdownContent().addChild(
          new Menu()
            .size('sm')
            .addClass('bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow')
            .setChildren([
              new MenuItem().label('Homepage').href('/homepage'),
              new MenuItem().label('Portfolio').href('/portfolio'),
              new MenuItem().label('About').href('/about'),
            ])
        ),
      ])
  ),
  new NavbarCenter().addChild(new Button().label('daisyUI').addClass('btn-ghost text-xl')),
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
const modal = new Modal().setChildren([
  new ModalHeader().text('This is the header'),
  new ModalBody().setChildren([
    new Divider(),
    new Paragraph().text('This is the body'),
    new Paragraph().text('This is also the body'),
    new Divider(),
  ]),
  new ModalFooter().setChildren([
    new Button().label('Stay Open').variant('primary'),
    new Button().label('Close Modal').setOnInvoke(() => modal.close()),
  ]),
]);

modal.render({ in: document.body });

const modalButton = new Button()
  .label('Show Modal')
  .variant('primary')
  .setOnInvoke(() => modal.open());

// Dropdown examples container
const dropdownExamples = new Flex()
  .setChildren([
    basicDropdown,
    dropdownWithHover,
    dropdownStart,
    dropdownEnd,
    dropdownTop,
    dropdownLeft,
    dropdownRight,
    dropdownWithLargeMenu,
  ])
  .direction('row')
  .gap('20px')
  .addClass('group-examples');

// Navbar examples container
const navbarExamples = new Flex()
  .setChildren([
    basicNavbar,
    navbarWithIcon,
    navbarWithStartCenterEnd,
    navbarWithMenu,
    navbarWithButtons,
    navbarWithColors,
    navbarWithDropdown,
  ])
  .direction('column')
  .gap('20px')
  .addClass('group-examples');

// Layout for the Stopwatch and Todo app
const layout = new Flex()
  .setChildren([
    stopwatchView,
    todoView,
    modalButton,
    selectTest,
    cardExamples,
    menuExamples,
    dropdownExamples,
    navbarExamples,
  ])
  .direction('column')
  .gap('25px')
  .alignItems('center');

const app = new Flex().setChildren([layout]).addClass('app');

app.render({ in: document.body });

// Test garbage collection
{
  new Button();
}
