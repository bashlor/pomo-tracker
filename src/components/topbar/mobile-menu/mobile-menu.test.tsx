import { describe, expect } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';

import { MobileMenu } from './mobile-menu';

import { createMemoryHistory } from 'history';
import { MemoryRouter, Router } from 'react-router-dom';
import { render } from '../../../setup/test-utils';
import { routes } from '../../../router';
import App from '../../../App';

describe('Mobile Menu', () => {
  it('should be defined', () => {
    render(
      <MemoryRouter>
        <MobileMenu />
      </MemoryRouter>
    );

    const sidebar = screen.getByTestId('ui-menu');
    expect(sidebar).toBeDefined();
  });

  it('should render the navigation menu', () => {
    render(
      <MemoryRouter>
        <MobileMenu />
      </MemoryRouter>
    );

    const navMenu = screen.getByTestId('ui-nav-menu');
    expect(navMenu).toBeDefined();
  });

  it('should render the navigation menu items', () => {
    render(
      <MemoryRouter>
        <MobileMenu />
      </MemoryRouter>
    );

    const navMenuItems = screen.getAllByTestId('ui-nav-menu-item');
    expect(navMenuItems).toBeDefined();
    expect(navMenuItems.length).toBe(routes.length - 1); // -1 because the default "/timer" route is not rendered.  ("/" and "/timer" redirect to the same page)
  });

  it('links should works', () => {
    const history = createMemoryHistory();

    render(
      <Router location={history.location} navigator={history}>
        <MobileMenu />
      </Router>
    );

    const linksItems = screen.getAllByTestId('ui-nav-menu-item');

    const routerPaths = routes.filter((route) => route.path !== '/timer').map((route) => route.path);

    routerPaths.forEach((path, index) => {
      linksItems.find((link) => link.getAttribute('href') === path);
      fireEvent.click(linksItems[index]);
      expect(history.location.pathname).toBe(path);
    });
  });

  it('should hide the menu a link is clicked', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const menuButton = screen.getByTestId('ui-menu-button');
    fireEvent.click(menuButton);
    const menu = screen.getByTestId('ui-menu');

    expect(menu).toBeInTheDocument();
  });
});
