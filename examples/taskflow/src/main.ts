import './style.css';
import { Flex } from 'svev-frontend';

const app = new Flex().setCss({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
});

app.render({ in: document.body });
