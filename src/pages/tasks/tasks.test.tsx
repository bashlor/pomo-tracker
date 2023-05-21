import { afterEach, beforeEach, describe, expect } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import { ApplicationData, TimerModeTypeObject } from '../../@types/app';
import { nanoid } from 'nanoid';
import { persistentApplicationDataKey } from '../../helpers/application';
import { Settings } from '../../@types/settings';
import { persistantSettingsKey } from '../../helpers/settings';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { routesReactRouter } from '../../router';
import { render } from '../../setup/test-utils';

describe('Page Tasks', () => {
  const appState: ApplicationData = {
    sequenceIndex: 0,
    timerMode: TimerModeTypeObject.enum.work,
    pomodoroSequences: [],
    currentTaskName: 'default',
    currentSequenceId: nanoid(),
    tasks: ['task 1', 'task 2'],
    version: import.meta.env.VITE_APP_VERSION as string,
  };

  const settings: Settings = {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sequence: 'W B W L',
    autoStartNextSequence: false,
    soundName: 'bell',
    soundVolume: 0,
    notifyBeforeTimerEnds: false,
    notifyBeforeTimerEndsDuration: 0,
  };

  beforeEach(() => {
    localStorage.setItem(persistantSettingsKey, JSON.stringify(settings));
    localStorage.setItem(persistentApplicationDataKey, JSON.stringify(appState));
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should render the page "tasks"', () => {
    const router = createMemoryRouter(routesReactRouter, {
      initialEntries: ['/tasks'],
      initialIndex: 0,
    });

    render(<RouterProvider router={router} />);

    const tasksElementPage = screen.getByTestId('tasks-page');
    expect(tasksElementPage).toBeInTheDocument();
  });

  it('should render the task list from local storage', () => {
    const router = createMemoryRouter(routesReactRouter, {
      initialEntries: ['/tasks'],
      initialIndex: 0,
    });

    render(<RouterProvider router={router} />);

    const taskListElement = screen.getByTestId('task-list');

    expect(taskListElement).toBeInTheDocument();

    const taskItems = screen.getAllByTestId('task-list-item');

    expect(taskItems.length).toBe(2);
    expect(taskItems[0].textContent).toBe('task 1');
    expect(taskItems[1].textContent).toBe('task 2');
  });

  it('should save when a task name is edited in local storage', () => {
    const router = createMemoryRouter(routesReactRouter, {
      initialEntries: ['/tasks'],
      initialIndex: 0,
    });

    const newTaskName = 'task 1 changed';

    render(<RouterProvider router={router} />);

    const taskListElement = screen.getByTestId('task-list');

    expect(taskListElement).toBeInTheDocument();

    const taskItems = screen.getAllByTestId('task-list-item');

    expect(taskItems.length).toBe(2);
    expect(taskItems[0].textContent).toBe('task 1');
    expect(taskItems[1].textContent).toBe('task 2');

    const firstTaskEditButton = screen.getAllByTestId('edit-task-button')[0];
    fireEvent.click(firstTaskEditButton);

    // Change the name of the first task
    const taskInput = screen.getByTestId('edit-task-input');

    fireEvent.input(taskInput, { target: { value: newTaskName } });
    fireEvent.keyDown(taskInput, { key: 'Enter' });

    expect(taskItems[0].textContent).toBe(newTaskName);

    const applicationData = JSON.parse(localStorage.getItem(persistentApplicationDataKey) || '{}');

    expect(applicationData.tasks.length).toBe(2);
    expect(applicationData.tasks.includes(newTaskName)).toBe(true);
  });
});
