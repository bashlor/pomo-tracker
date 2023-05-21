import { describe, expect } from 'vitest';
import { screen } from '@testing-library/react';
import App from './App';
import { render } from './setup/test-utils';
import { MemoryRouter } from 'react-router-dom';

describe('Should load Grommet', () => {
  it('should render the application top bar', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    const topBar = screen.getByTestId('ui-topbar');
    expect(topBar).toBeVisible();
  });
});
