import { BoolInput, BoolView, render, ViewFactory } from 'svev-frontend';
import { Fragment } from '../../src/Fragment';
import { effect } from '../../src/signals/signals';

const app = document.querySelector<HTMLDivElement>('#app')!;

ViewFactory.instance.register(BoolInput, BoolView);

const inputs: BoolInput[] = [];
for (let i = 0; i < 20; ++i) {
  inputs.push(new BoolInput());
}

const fragment1 = new Fragment();
const fragment2 = new Fragment();
for (let i = 0; i < 20; ++i) {
  inputs[i].label(`Label for ${i}`);
  if (i % 2 === 0) {
    effect(() => {
      const v = inputs[i].value();
      inputs[i + 1].isVisible(v);
    });
  } else {
    inputs[i].isEnabled(false);
  }

  if (i < 10) {
    fragment1.push(inputs[i]);
  } else {
    fragment2.push(inputs[i]);
  }
}

render(app, fragment1);
render(app, fragment2);
