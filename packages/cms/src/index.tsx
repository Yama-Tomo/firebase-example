import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { initialize } from '~/libs/firebase';
import { SessionStateProvider } from '~/state';

initialize();
ReactDOM.render(
  <SessionStateProvider>
    <App />
  </SessionStateProvider>,
  document.getElementById('root')
);
