import { ButtonStory } from './src/ButtonStory';
import './style.css';

const app = document.querySelector<HTMLDivElement>('#app')!;

const buttonStory = new ButtonStory();
app.appendChild(buttonStory.createUI());
