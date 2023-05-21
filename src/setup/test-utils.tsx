import { render } from '@testing-library/react';
import { Grommet } from 'grommet';
import { Provider } from 'jotai';

function customRender(ui: React.ReactElement, options = {}) {
  return render(ui, {
    // wrap provider(s) here if needed
    wrapper: ({ children }) => (
      <Provider>
        <Grommet>{children}</Grommet>
      </Provider>
    ),
    ...options,
  });
}

export * from '@testing-library/react';
export { customRender as render };
