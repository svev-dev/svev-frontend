import { hello } from 'svev-frontend';

const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `<h1>${hello('World')}</h1>`;
