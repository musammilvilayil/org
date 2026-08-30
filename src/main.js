import React from 'react';
import {createRoot} from 'react-dom/client';
import htm from 'htm';
import App from './App.js';
import './styles.css';

const html = htm.bind(React.createElement);
createRoot(document.getElementById('root')).render(html`<${App}/>`);

const MESSAGE_TOTAL_FROM = '60,617';
const MESSAGE_TOTAL_TO = '178,617';

function replaceMessageTotal(root = document.body) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    if (node.nodeValue?.includes(MESSAGE_TOTAL_FROM)) {
      node.nodeValue = node.nodeValue.replaceAll(MESSAGE_TOTAL_FROM, MESSAGE_TOTAL_TO);
    }
  }
}

replaceMessageTotal();
new MutationObserver(() => replaceMessageTotal()).observe(document.getElementById('root'), {
  childList: true,
  subtree: true,
  characterData: true,
});
