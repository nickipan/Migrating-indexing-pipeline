import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Login from './Pages/Login/Login.jsx'
import Indexer from './Pages/Indexer/Indexer.jsx'

import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
    errorElement: <div>404 Not Found</div>
  },
  {
    path: '/indexer',
    element: <Indexer />,
    errorElement: <div>404 Not Found</div>
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
