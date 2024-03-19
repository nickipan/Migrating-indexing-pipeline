import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { FronteggProvider } from '@frontegg/react';

// import Login from './Pages/Login/Login.jsx'
import Indexer from './Pages/Indexer/Indexer.jsx'
import Ongoing from './Pages/Ongoing/Ongoing.jsx'

import './index.css'

const router = createBrowserRouter([
  // {
  //   path: '/',
  //   element: <Login />,
  //   errorElement: <div>404 Not Found</div>
  // },
  {
    path: '/',
    element: <Indexer />,
    errorElement: <div>404 Not Found</div>
  },
  {
    path: '/oauth/callback',
    element: <Indexer />,
    errorElement: <div>404 Not Found</div>
  },
  {
    path: '/ongoing',
    element: <Ongoing />,
    errorElement: <div>404 Not Found</div>
  },
]);

const contextOptions = {
  baseUrl: 'https://app-tgykkemfuyek.frontegg.com',
  clientId: 'd6a206fe-eafe-44fe-97c3-b1143272124f',
  // redirectUri: ${window.location.origin}/call
};

const authOptions = {
  keepSessionAlive: true // Uncomment this in order to maintain the session alive
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FronteggProvider
      contextOptions={contextOptions}
      hostedLoginBox={true}
      authOptions={authOptions}>
    {/* <FronteggProvider contextOptions={contextOptions} hostedLoginBox={false} authOptions={authOptions}> */}
      <RouterProvider router={router} />
    </FronteggProvider>
  </React.StrictMode>,
)
