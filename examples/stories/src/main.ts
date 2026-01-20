import { Flex } from 'svev-frontend';
import { ButtonStory } from './elementStories/ButtonStory';
import { BoolInputStory } from './elementStories/BoolInputStory';
import './style.css';
import { TabsStory } from './elementStories/TabsStory';

const buttonStory = new ButtonStory();
const boolInputStory = new BoolInputStory();
const tabsStory = new TabsStory();

const flex = new Flex().setChildren([buttonStory, boolInputStory, tabsStory]);

const app = new Flex().setChildren([flex]).setCss({
  minHeight: '100vh',
  minWidth: '100vw',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
});

app.render({ in: document.body });
