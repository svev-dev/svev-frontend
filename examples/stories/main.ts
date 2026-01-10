import { Flex } from 'svev-frontend';
import { ButtonStory } from './src/ButtonStory';
import { BoolInputStory } from './src/BoolInputStory';
import './style.css';

const app = document.querySelector<HTMLDivElement>('#app')!;

const buttonStory = new ButtonStory();
const boolInputStory = new BoolInputStory();

const flex = new Flex().setChildren([buttonStory, boolInputStory]);

flex.render({ in: app });
