import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import App from './App';

const render = App => {
  const root = document.getElementById('root');

  ReactDOMClient.createRoot(root, <App />);
};

render(App);