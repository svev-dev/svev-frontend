import { BoolInput, BoolView, render, ViewFactory } from 'svev-frontend';
import { Collection } from '../../src/Collection';

const app = document.querySelector<HTMLDivElement>('#app')!;

ViewFactory.instance.register(BoolInput, BoolView);

const collection = new Collection();
for (let i = 0; i < 10; ++i) {
  const input = new BoolInput();
  input.label(`Label for ${i}`);
  collection.push(input);
}

render(app, collection);
