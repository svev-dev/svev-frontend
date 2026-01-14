import { Flex } from 'svev-frontend';
import { ButtonStory } from './ButtonStory';
import { BoolInputStory } from './BoolInputStory';
import './style.css';

const buttonStory = new ButtonStory();
const boolInputStory = new BoolInputStory();

const flex = new Flex().setChildren([buttonStory, boolInputStory]);

const app = new Flex().setChildren([flex]).setCss({
  minHeight: '100vh',
  minWidth: '100vw',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
});

app.render({ in: document.body });
