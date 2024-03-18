import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// import { FronteggProvider } from "@frontegg/react-core";
// import { uiLibrary } from "@frontegg/react-elements-semantic";
// import { AuthPlugin } from "@frontegg/react-auth";
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
    path: '/ongoing',
    element: <Ongoing />,
    errorElement: <div>404 Not Found</div>
  },
]);

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <RouterProvider router={router} />
//   </React.StrictMode>,
// )

const contextOptions = {
  baseUrl: 'https://app-tgykkemfuyek.frontegg.com',
  clientId: 'd6a206fe-eafe-44fe-97c3-b1143272124f'
};

// const urls = {
//   oauthCallbackUrl: "http://localhost:8081/indexerui/auth/callback/",
// };
// http://localhost:8081/oauth/callback?code=ZDZhMjA2ZmUtZWFmZS00NGZlLTk3YzMtYjExNDMyNzIxMjRmLTcxZGE4MDZjLWM5MTUtNDI1YS04YjRiLTNlYWRjODZjNjJiYw%3D%3D&nonce=q37ZWUs3Ladjp2Lx
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

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <FronteggProvider
//     contextOptions={contextOptions}
//     hostedLoginBox={true}
//     authOptions={authOptions}>
//     <Login />
//   </FronteggProvider>,
//   // <React.StrictMode>
//   //   <RouterProvider router={router} />
//   // </React.StrictMode>,
//   // document.getElementById('root')
// );
