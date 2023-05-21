import { afterEach, beforeEach, describe, expect } from 'vitest';
import { RunningTask } from './running-task';
import { fireEvent, render, screen } from '@testing-library/react';
import { getDefaultSettings, persistantSettingsKey } from '../../helpers/settings';
import { Settings } from '../../@types/settings';
import { getDefaultApplicationData, persistentApplicationDataKey } from '../../helpers/application';
import { ApplicationData } from '../../@types/app';

describe('Running Task', () => {
  it('should render the running task', () => {
    render(<RunningTask />);

    const runningTask = screen.getByTestId('running-task');
    expect(runningTask).toBeInTheDocument();
  });

  it('should render the fieldset with the input linked to "name" label', () => {
    render(<RunningTask />);

    const input = screen.getByTestId('running-task-input');

    expect(input).toHaveAttribute('id', 'name');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('task name should be injected from the input using props', () => {
    render(<RunningTask taskName="test" />);

    const input = screen.getByTestId('running-task-input');
    expect(input).toHaveValue('test');
  });

  it('task name input should be loaded with the taskName props or set to default task name if taskName is not defined', () => {
    render(<RunningTask />);

    const input = screen.getByTestId('running-task-input');
    expect(input).toHaveValue(getDefaultApplicationData().currentTaskName);
  });

  it('task name should be updated if taskName props is updated', () => {
    const { rerender } = render(<RunningTask taskName="test" />);

    const input = screen.getByTestId('running-task-input');
    expect(input).toHaveValue('test');
    rerender(<RunningTask taskName="test 2" />);
    expect(input).toHaveValue('test 2');
  });

  it('task name input should be editable', () => {
    render(<RunningTask taskName="test" />);

    const input = screen.getByTestId('running-task-input');

    if (!input) {
      throw new Error('input not found');
    }

    fireEvent.input(input, { target: { value: 'updated name' } });

    expect(input).toHaveValue('updated name');
  });

  describe('Task name saving in localstorage', () => {
    let settings: Settings;
    let appState: ApplicationData;

    beforeEach(() => {
      settings = getDefaultSettings();
      appState = getDefaultApplicationData();

      localStorage.setItem(persistantSettingsKey, JSON.stringify(settings));
      localStorage.setItem(persistentApplicationDataKey, JSON.stringify(appState));
    });

    afterEach(() => {
      localStorage.clear();
    });

    it('should save current task name in the local storage', () => {
      render(<RunningTask taskName="test" />);

      const input = screen.getByTestId('running-task-input');

      const newTaskName = 'new task name';

      fireEvent.input(input, { target: { value: newTaskName } });

      expect(input).toHaveValue(newTaskName);

      const applicationState = JSON.parse(localStorage.getItem(persistentApplicationDataKey) || '{}');

      expect(applicationState.currentTaskName).toBe(newTaskName);
    });
  });
});
