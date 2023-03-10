import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Auth0Provider
    domain="dev-ow5mhnbdk5tu0hik.us.auth0.com"
    clientId="ZIW4QsnjWWvp0gM8TcksIAn9NHWQDdIo"
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
    <App />
  </Auth0Provider>
);
