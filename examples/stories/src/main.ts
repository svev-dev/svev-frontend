import { Flex, BrowserNavigator } from 'svev-frontend';
import { ButtonStory } from './elementStories/ButtonStory';
import { BoolInputStory } from './elementStories/BoolInputStory';
import { TabsStory } from './elementStories/TabsStory';
import { Menu, MenuItem } from 'svev-daisyui';

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

const buttonStory = new ButtonStory();
const boolInputStory = new BoolInputStory();
const tabsStory = new TabsStory();

const flex = new Flex().setChildren([buttonStory, boolInputStory, tabsStory]);

const app = new Flex().setChildren([flex]).addClass('app');

app.render({ in: document.body });
