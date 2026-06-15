import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/index.css';
import 'altcha/external';
import Pbkdf2Worker from 'altcha/workers/pbkdf2?worker';
import ShaWorker from 'altcha/workers/sha?worker';

globalThis.$altcha?.algorithms.set('PBKDF2/SHA-256', () => new Pbkdf2Worker());
globalThis.$altcha?.algorithms.set('PBKDF2/SHA-384', () => new Pbkdf2Worker());
globalThis.$altcha?.algorithms.set('PBKDF2/SHA-512', () => new Pbkdf2Worker());
globalThis.$altcha?.algorithms.set('SHA-256', () => new ShaWorker());
globalThis.$altcha?.algorithms.set('SHA-384', () => new ShaWorker());
globalThis.$altcha?.algorithms.set('SHA-512', () => new ShaWorker());

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
