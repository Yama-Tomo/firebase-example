import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { initializeFirebase } from '~/libs';
import { SessionStateProvider } from '~/state';

initializeFirebase();

ReactDOM.render(
  <BrowserRouter>
    <SessionStateProvider>
      <App />
    </SessionStateProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
