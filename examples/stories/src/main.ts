import './style.css';
import { Flex } from 'svev-frontend';
import { ButtonStory } from './elementStories/ButtonStory';
import { BoolInputStory } from './elementStories/BoolInputStory';
import { TabsStory } from './elementStories/TabsStory';

const buttonStory = new ButtonStory();
const boolInputStory = new BoolInputStory();
const tabsStory = new TabsStory();

const flex = new Flex().setChildren([buttonStory, boolInputStory, tabsStory]);

const app = new Flex().setChildren([flex]).addClass('app');

app.render({ in: document.body });
