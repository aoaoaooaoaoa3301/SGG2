import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
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
    basename: '/SGG2/', 
  });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode >
    <ConfigProvider 
      theme={{
          hashed: false,
          hashPriority: 'low'
      }}
    >
      <RouterProvider router={router} theme={{ cssVar: true, hashed: false }} />
    </ConfigProvider>
  </React.StrictMode>
);
