import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import App from './App';
import { Timer } from './pages/timer/timer';
import { Settings } from './pages/settings/settings';
import { Clock, Task, UserSettings } from 'grommet-icons';
import React from 'react';
import { Tasks } from './pages/tasks/tasks';

export const routes = [
  {
    path: '/',
    name: 'timer',
    element: <Timer />,
    icon: <Clock />,
  },
  {
    path: '/timer',
    name: 'timer',
    element: <Timer />,
    icon: <Clock />,
  },
  {
    path: '/tasks',
    name: 'tasks',
    element: <Tasks />,
    icon: <Task />,
  },
  {
    path: '/settings',
    name: 'settings',
    element: <Settings />,
    icon: <UserSettings />,
  },
];

export const routesReactRouter = createRoutesFromElements(
  <Route element={<App />}>
    {routes.map((route) => {
      return <Route key={route.path} path={route.path} element={route.element} />;
    })}
  </Route>
);

const router = createBrowserRouter(routesReactRouter);
export default router;
