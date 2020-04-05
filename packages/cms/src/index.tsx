import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { initialize } from '~/libs/firebase';
import { SessionStateProvider } from '~/state';

initialize();

ReactDOM.render(
  <BrowserRouter>
    <SessionStateProvider>
      <App />
    </SessionStateProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
