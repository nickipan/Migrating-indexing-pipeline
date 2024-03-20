import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { FronteggProvider } from '@frontegg/react';
import {
  Route,
  createRoutesFromElements,
} from "react-router-dom";
// import { Root } from "./Root";
// import { Settings } from "./Settings";

import Indexer from './Pages/Indexer/Indexer.jsx'
import Ongoing from './Pages/Ongoing/Ongoing.jsx'

import './index.css'

const contextOptions = {
  baseUrl: 'https://app-tgykkemfuyek.frontegg.com',
  clientId: 'd6a206fe-eafe-44fe-97c3-b1143272124f'
};

const authOptions = {
  keepSessionAlive: true // Uncomment this in order to maintain the session alive
};

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: < FronteggProvider
//                contextOptions={ contextOptions }
//                hostedLoginBox={ true} >
//                 <Indexer />
//               </FronteggProvider >,
//     errorElement: <div>404 Not Found</div>
//   },
//   {
//     path: '/oauth/callback',
//     element: <Indexer />,
//     errorElement: <div>404 Not Found</div>
//   },
//   {
//     path: '/ongoing',
//     element: <Ongoing />,
//     errorElement: <div>404 Not Found</div>
//   },
// ]);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={
        <FronteggProvider contextOptions={contextOptions} hostedLoginBox={true}>
          <Indexer />
        </FronteggProvider>
      }
      errorElement={<div>404 Not Found</div>}
    >
      <Route path="/oauth/callback" element={<Indexer />} errorElement={<div>404 Not Found</div>} />
      <Route path="/ongoing" element={<Ongoing />} errorElement={<div>404 Not Found</div>} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <FronteggProvider
      contextOptions={contextOptions}
      hostedLoginBox={true}
      authOptions={authOptions}>
      <RouterProvider router={router} />
      <Indexer></Indexer>
    </FronteggProvider> */}
    <RouterProvider router={router} />
  </React.StrictMode>,
)
