import { Flex, BrowserNavigator } from 'svev-frontend';
import { ButtonStory } from './elementStories/ButtonStory';
import { BoolInputStory } from './elementStories/BoolInputStory';
import { TabsStory } from './elementStories/TabsStory';
import { Menu, MenuItem } from 'svev-daisyui';

const buttonStory = new ButtonStory();
const boolInputStory = new BoolInputStory();
const tabsStory = new TabsStory();

// const navigator = new BrowserNavigator();
//     .setSubmenu(new Menu().setChildren([ ]))

const mainMenu = new Menu().setChildren([
  new MenuItem()
    .isTitle(true)
    .label('Elements')
    .setSubmenu(
      new Menu().setChildren([
        new MenuItem().label('Button').href('/button'),
        new MenuItem().label('Bool Input').href('/boolInput'),
        new MenuItem().label('Tabs').href('/tabs'),
      ])
    ),
  new MenuItem()
    .isTitle(true)
    .label('Elements')
    .setSubmenu(
      new Menu().setChildren([
        new MenuItem().label('Button').href('/button'),
        new MenuItem().label('Bool Input').href('/boolInput'),
        new MenuItem().label('Tabs').href('/tabs'),
      ])
    ),
]);

const flex = new Flex().setChildren([mainMenu, buttonStory, boolInputStory, tabsStory]);
//const app = new Flex().setChildren([flex]).addClass('app');

// const app = new Flex().setChildren([flex]).setCss({
//   minHeight: '100vh',
//   minWidth: '100vw',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   flexDirection: 'column',
// });

// const router = new Router(navigator, createNavigationUI)
//   .add('/', createHomeUI)
//   .add('/about', createAboutUI)
//   .add('/users/*', userRouter)
//   .add('*', create404UI);

// router.render({ in: document.body });

flex.render({ in: document.body });
