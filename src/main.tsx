import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './router';

import './index.css';
import { DayTimeContextProvider } from './context/daytime-provider-context';
import { theme } from './util/theme';
import { Grommet } from 'grommet';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <DayTimeContextProvider>
      {/** Added at the same time when the context was created , to wrap the whole app, cannot be tested **/}
      <Grommet full theme={theme} data-testid="grommet">
        <RouterProvider router={router} />
      </Grommet>
    </DayTimeContextProvider>
  </React.StrictMode>
);
