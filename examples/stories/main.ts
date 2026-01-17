import { ButtonStory } from './src/ButtonStory';
import { BoolInputStory } from './src/BoolInputStory';
import { TabsStory } from './src/TabsStory';
import './style.css';

const app = document.querySelector<HTMLDivElement>('#app')!;

const buttonStory = new ButtonStory();
const boolInputStory = new BoolInputStory();
const tabsStory = new TabsStory();

const flex = new Flex().setChildren([buttonStory, boolInputStory, tabsStory]);

flex.render({ in: app });
