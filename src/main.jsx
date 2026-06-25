import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App, { CatalogPage } from './App';
import ContentMap from './components/contentMap'

import './components/styleContent.css'
import './style.css'

const basename = import.meta.env.BASE_URL;

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <ContentMap /> },
      { path: ':category', element: <CatalogPage /> },
    ],
  },
],
{
    basename: '/SGG/', 
  });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);