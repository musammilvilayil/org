import React from 'react';
import {createRoot} from 'react-dom/client';
import htm from 'htm';
import App from './App.js';
import './styles.css';

const html = htm.bind(React.createElement);
createRoot(document.getElementById('root')).render(html`<${App}/>`);
