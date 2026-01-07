import { Flex } from 'svev-frontend';
import { ButtonStory } from './src/ButtonStory';
import { CheckboxStory } from './src/CheckboxStory';
import './style.css';

const app = document.querySelector<HTMLDivElement>('#app')!;

const buttonStory = new ButtonStory();
const checkboxStory = new CheckboxStory();

const flex = new Flex([buttonStory, checkboxStory]);

//app.appendChild(buttonStory.createUI());
app.appendChild(flex.createUI());
