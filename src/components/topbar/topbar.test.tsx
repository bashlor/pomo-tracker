import { describe, expect } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import { render } from '../../setup/test-utils';
import { Topbar } from './topbar';

import App from '../../App';
import { MemoryRouter } from 'react-router-dom';

describe('topbar', () => {
  it('should render the application top bar', () => {
    render(
      <MemoryRouter>
        <Topbar />
      </MemoryRouter>
    );

    const topBar = screen.getByTestId('ui-topbar');
    expect(topBar).toBeDefined();
  });

  it('should render the application brand', () => {
    render(
      <MemoryRouter>
        <Topbar />
      </MemoryRouter>
    );

    const brand = screen.getByTestId('ui-brand');
    expect(brand).toBeInTheDocument();
    expect(brand).toHaveTextContent('PomoTracker');
  });

  it('should render the menu button', () => {
    render(
      <MemoryRouter>
        <Topbar />
      </MemoryRouter>
    );

    const menuButton = screen.getByTestId('ui-menu-button');
    expect(menuButton).toBeInTheDocument();
  });

  it('should show the menu when the menu button is clicked', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const menuButton = screen.getByTestId('ui-menu-button');
    fireEvent.click(menuButton);
    const sidebar = screen.getByTestId('ui-menu');
    expect(sidebar).toBeInTheDocument();
  });
});
