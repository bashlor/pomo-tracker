import { afterEach, beforeEach, describe, expect, vi } from 'vitest';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { routesReactRouter } from '../../router';
import { render, screen } from '@testing-library/react';
import { Settings } from '../../@types/settings';
import { persistantSettingsKey } from '../../helpers/settings';
describe('Settings', () => {
  beforeEach(() => {
    vi.mock('../../hooks/use-settings');
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should render the settings page', () => {
    const router = createMemoryRouter(routesReactRouter, {
      initialEntries: ['/settings'],
      initialIndex: 0,
    });

    render(<RouterProvider router={router} />);

    const settingsElementPage = screen.getByTestId('settings-page');
    expect(settingsElementPage).toBeInTheDocument();
  });

  it('should render the formfield with his label for the work duration', () => {
    const router = createMemoryRouter(routesReactRouter, {
      initialEntries: ['/settings'],
      initialIndex: 0,
    });

    render(<RouterProvider router={router} />);

    const inputRange = screen.getByTestId('work-duration-input');

    expect(inputRange).toHaveAttribute('id', 'work-duration');
  });

  it('should render the formfield with his label for the short break duration', () => {
    const router = createMemoryRouter(routesReactRouter, {
      initialEntries: ['/settings'],
      initialIndex: 0,
    });

    render(<RouterProvider router={router} />);

    const inputRange = screen.getByTestId('short-break-duration-input');

    expect(inputRange).toHaveAttribute('id', 'short-break-duration');
  });

  it('should render the formfield his label for the long break duration', () => {
    const router = createMemoryRouter(routesReactRouter, {
      initialEntries: ['/settings'],
      initialIndex: 0,
    });

    render(<RouterProvider router={router} />);

    const inputRange = screen.getByTestId('long-break-duration-input');

    expect(inputRange).toHaveAttribute('id', 'long-break-duration');
  });

  it("should render inside the fieldset a 'reset' button", () => {
    const router = createMemoryRouter(routesReactRouter, {
      initialEntries: ['/settings'],
      initialIndex: 0,
    });

    render(<RouterProvider router={router} />);
    const button = screen.getByTestId('reset-button');

    expect(button).toHaveTextContent('Reset');
  });

  it('should render inside the fieldset a text input field with his label for the sequence', () => {
    const router = createMemoryRouter(routesReactRouter, {
      initialEntries: ['/settings'],
      initialIndex: 0,
    });

    render(<RouterProvider router={router} />);

    expect(screen.getByTestId('sequence-input-builder')).toBeInTheDocument();
  });

  it('should retrieve the settings from the local storage and load it in input fields', () => {
    const savedSettings: Settings = {
      workDuration: 30,
      shortBreakDuration: 10,
      longBreakDuration: 20,
      sequence: 'W B W B W B W B W L',
      autoStartNextSequence: false,
      soundName: 'bell',
      soundVolume: 0,
      notifyBeforeTimerEnds: false,
      notifyBeforeTimerEndsDuration: 0,
    };

    localStorage.setItem(persistantSettingsKey, JSON.stringify(savedSettings));

    const router = createMemoryRouter(routesReactRouter, {
      initialEntries: ['/settings'],
      initialIndex: 0,
    });

    render(<RouterProvider router={router} />);

    screen.getByTestId('tag-input-box');

    const workDurationInput = screen.getByTestId('work-duration-input');
    const shortBreakDurationInput = screen.getByTestId('short-break-duration-input');
    const longBreakDurationInput = screen.getByTestId('long-break-duration-input');

    const tagInputs = screen.getAllByTestId('tag-input');
    const tagInputTextString = tagInputs
      .map((tagInput) => tagInput.textContent?.split('-')[1].trim()[0])
      .map((firstChar) => (firstChar === 'S' ? 'B' : firstChar))
      .join(' ');

    expect(workDurationInput).toHaveValue(savedSettings.workDuration.toString());
    expect(shortBreakDurationInput).toHaveValue(savedSettings.shortBreakDuration.toString());
    expect(longBreakDurationInput).toHaveValue(savedSettings.longBreakDuration.toString());
    expect(tagInputTextString).toEqual(savedSettings.sequence);
  });
});
