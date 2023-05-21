import { act, fireEvent, screen } from '@testing-library/react';
import { render } from '../../setup/test-utils';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { routesReactRouter } from '../../router';
import { afterEach, beforeEach, expect, vi } from 'vitest';
import { persistantSettingsKey } from '../../helpers/settings';
import { Settings } from '../../@types/settings';
import { ApplicationData, TimerModeTypeObject } from '../../@types/app';
import { persistentApplicationDataKey } from '../../helpers/application';
import { getTimerModeLabel, timerModeToDurationInSeconds } from '../../helpers/pomodoro';
import { computeTimerText, getDayTimeProviderConfiguration } from '../../helpers/time';
import { DayTimeContextProvider } from '../../context/daytime-provider-context';
import { nanoid } from 'nanoid';
import { Grommet } from 'grommet';

describe('Page Timer', () => {
  const appState: ApplicationData = {
    sequenceIndex: 0,
    timerMode: TimerModeTypeObject.enum.work,
    pomodoroSequences: [],
    currentTaskName: 'default',
    currentSequenceId: nanoid(),
    tasks: [],
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

  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  beforeEach(() => {
    localStorage.setItem(persistantSettingsKey, JSON.stringify(settings));
    localStorage.setItem(persistentApplicationDataKey, JSON.stringify(appState));
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should render the page "timer"', () => {
    const router = createMemoryRouter(routesReactRouter, {
      initialEntries: ['/timer'],
      initialIndex: 0,
    });

    render(<RouterProvider router={router} />);

    const timerElementPage = screen.getByTestId('timer-page');
    expect(timerElementPage).toBeInTheDocument();
  });

  it('should render the page "timer" , with path "/"', () => {
    const router = createMemoryRouter(routesReactRouter, {
      initialEntries: ['/'],
      initialIndex: 0,
    });

    render(<RouterProvider router={router} />);

    const timerElementPage = screen.getByTestId('timer-page');
    expect(timerElementPage).toBeInTheDocument();
  });

  it('should render the Pomodoro Timer component in the page', () => {
    const router = createMemoryRouter(routesReactRouter, {
      initialEntries: ['/timer'],
      initialIndex: 0,
    });

    render(<RouterProvider router={router} />);

    const pomodoroTimer = screen.getByTestId('pomodoro-timer');
    expect(pomodoroTimer).toBeInTheDocument();
  });

  it('should load work duration from local storage and set initialTime to parsed work duration', () => {
    const router = createMemoryRouter(routesReactRouter, {
      initialEntries: ['/timer'],
      initialIndex: 0,
    });

    render(<RouterProvider router={router} />);

    const pomodoroTimer = screen.getByTestId('pomodoro-timer');
    expect(pomodoroTimer).toHaveTextContent('25:00');
  });

  it('should load the sequence index from user preferences (saved in local storage) and load correct duration', () => {
    const appState: ApplicationData = {
      sequenceIndex: 3,
      timerMode: TimerModeTypeObject.enum.longBreak,
      pomodoroSequences: [],
      currentTaskName: 'default',
      currentSequenceId: nanoid(),
      tasks: [],
      version: import.meta.env.VITE_APP_VERSION as string,
    };

    localStorage.setItem(persistentApplicationDataKey, JSON.stringify(appState));

    const router = createMemoryRouter(routesReactRouter, {
      initialEntries: ['/timer'],
      initialIndex: 3,
    });

    render(<RouterProvider router={router} />);
    const pomodoroTimer = screen.getByTestId('pomodoro-timer');

    expect(pomodoroTimer).toHaveTextContent('15:00');
  });

  it('should loop based on the sequence and load correct duration and show basic infos', () => {
    const sequenceMode = [
      TimerModeTypeObject.enum.work,
      TimerModeTypeObject.enum.shortBreak,
      TimerModeTypeObject.enum.work,
      TimerModeTypeObject.enum.longBreak,
    ];

    localStorage.setItem(persistantSettingsKey, JSON.stringify(settings));
    localStorage.setItem(persistentApplicationDataKey, JSON.stringify(appState));

    const router = createMemoryRouter(routesReactRouter, {
      initialEntries: ['/timer'],
      initialIndex: 0,
    });

    render(
      <Grommet>
        <RouterProvider router={router} />
      </Grommet>
    );
    const pomodoroTimer = screen.getByTestId('pomodoro-timer');
    const startButton = screen.getByTestId('pomodoro-start-button');
    const timerMode = screen.getByTestId('timer-mode');
    const nextTimerMode = screen.getByTestId('next-timer-mode-button');

    for (let i = 0; i < sequenceMode.length; i++) {
      fireEvent.click(startButton);
      act(() => {
        vi.advanceTimersByTime(25 * 60 * 1000);
      });
      const computedTimerText = computeTimerText(timerModeToDurationInSeconds(settings, sequenceMode[(i + 1) % 4]));
      expect(pomodoroTimer).toHaveTextContent(computedTimerText);
      expect(timerMode).toHaveTextContent(getTimerModeLabel(sequenceMode[(i + 1) % 4])._unsafeUnwrap());
      expect(nextTimerMode).toHaveTextContent(getTimerModeLabel(sequenceMode[(i + 2) % 4])._unsafeUnwrap());
    }
  });

  it('should load the timer page with the date and time in a french format', () => {
    const router = createMemoryRouter(routesReactRouter, {
      initialEntries: ['/timer'],
      initialIndex: 0,
    });

    const dateNow = new Date(2023, 0, 1, 12, 30);
    const dayTimeProviderConfiguration = getDayTimeProviderConfiguration(() => dateNow, 'fr');

    const localDay = dayTimeProviderConfiguration.now().toLocaleDateString(dayTimeProviderConfiguration.locales, { weekday: 'long' });
    const localTime = dayTimeProviderConfiguration.now().toLocaleTimeString(dayTimeProviderConfiguration.locales, {
      hour: 'numeric',
      minute: 'numeric',
      hour12: dayTimeProviderConfiguration.hour12,
    });

    const expectedComputedDateString = `${localDay}, ${localTime}`;

    render(
      <DayTimeContextProvider dayTimeProvider={dayTimeProviderConfiguration}>
        <RouterProvider router={router} />
      </DayTimeContextProvider>
    );

    const computedDateStringFromDateComponent = screen.getByTestId('date-component-computed-date');

    expect(computedDateStringFromDateComponent).toHaveTextContent(expectedComputedDateString);
  });

  it('should update the date and time when the date changes', () => {
    const router = createMemoryRouter(routesReactRouter, {
      initialEntries: ['/timer'],
      initialIndex: 0,
    });

    const dayTimeProviderConfiguration = getDayTimeProviderConfiguration(() => new Date(Date.now()), 'en-US');

    render(
      <DayTimeContextProvider dayTimeProvider={dayTimeProviderConfiguration}>
        <RouterProvider router={router} />
      </DayTimeContextProvider>
    );

    const computedDateBefore = screen.getByTestId('date-component-computed-date').textContent as string;
    act(() => {
      vi.advanceTimersByTime(60 * 1000);
    });
    const computedDateAfter = screen.getByTestId('date-component-computed-date').textContent as string;

    expect(computedDateBefore < computedDateAfter).toBeTruthy();
  });

  it('should have the component pomodoro stats info', () => {
    const router = createMemoryRouter(routesReactRouter, {
      initialEntries: ['/timer'],
      initialIndex: 0,
    });

    render(<RouterProvider router={router} />);

    const pomodoroStatsInfo = screen.getByTestId('pomodoro-stats-info');
    expect(pomodoroStatsInfo).toBeInTheDocument();
  });

  it('should read the pomodoro stats from local storage and display them', () => {
    const appState: ApplicationData = {
      sequenceIndex: 2,
      timerMode: TimerModeTypeObject.enum.work,
      pomodoroSequences: [
        {
          id: nanoid(),
          sequence: 'W B W L W B',
          taskName: 'default',
          sessions: [
            {
              id: nanoid(),
              timerMode: TimerModeTypeObject.enum.work,
              startDate: new Date(2023, 0, 1, 12, 0),
              endDate: new Date(2023, 0, 1, 12, 25),
              sequence: {
                index: 0,
                cycle: 'W B W L W B',
              },
            },
          ],
        },
      ],
      currentTaskName: 'default',
      currentSequenceId: nanoid(),
      tasks: [],
      version: import.meta.env.VITE_APP_VERSION,
    };

    const settings: Settings = {
      workDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      sequence: 'W B W L W B',
      autoStartNextSequence: false,
      soundName: 'bell',
      soundVolume: 0,
      notifyBeforeTimerEnds: false,
      notifyBeforeTimerEndsDuration: 0,
    };

    const dayTimeProvider = getDayTimeProviderConfiguration(() => new Date(2023, 0, 1, 15, 25), 'en-US');

    localStorage.setItem(persistantSettingsKey, JSON.stringify(settings));
    localStorage.setItem(persistentApplicationDataKey, JSON.stringify(appState));

    const router = createMemoryRouter(routesReactRouter, {
      initialEntries: ['/timer'],
      initialIndex: 0,
    });

    render(
      <DayTimeContextProvider dayTimeProvider={dayTimeProvider}>
        <RouterProvider router={router} />
      </DayTimeContextProvider>
    );

    const sequenceIndex = screen.getByTestId('sequence-index');
    const workedSequences = screen.getByTestId('worked-sequences');

    expect(sequenceIndex).toHaveTextContent(`${3}/${6}`);

    expect(workedSequences).toHaveTextContent('1');
  });

  it('click on button Next Sequence should skip the current sequence', () => {
    const router = createMemoryRouter(routesReactRouter, {
      initialEntries: ['/timer'],
      initialIndex: 0,
    });

    render(<RouterProvider router={router} />);

    const nextSequenceButton = screen.getByTestId('next-timer-mode-button');
    const pomodoroTimer = screen.getByTestId('pomodoro-timer');

    expect(nextSequenceButton).toBeInTheDocument();

    fireEvent.click(nextSequenceButton);

    const parsedApplicationData = JSON.parse(localStorage.getItem(persistentApplicationDataKey) as string) as ApplicationData;

    expect(parsedApplicationData.sequenceIndex).toBe(1);
    expect(parsedApplicationData.timerMode).toBe(TimerModeTypeObject.enum.shortBreak);

    expect(pomodoroTimer).toHaveTextContent('05:00');
  });

  it('should contain the checkbox container for allowing the user to link the session to a task', () => {
    const router = createMemoryRouter(routesReactRouter, {
      initialEntries: ['/timer'],
      initialIndex: 0,
    });

    render(<RouterProvider router={router} />);

    const checkboxContainer = screen.getByTestId('link-session-to-task-container');

    expect(checkboxContainer).toBeInTheDocument();
  });

  it('if the link session to task checkbox is checked, the running task component should be present', () => {
    const router = createMemoryRouter(routesReactRouter, {
      initialEntries: ['/timer'],
      initialIndex: 0,
    });

    render(<RouterProvider router={router} />);

    const checkboxContainer = screen.getByTestId('link-session-to-task-container');

    // eslint-disable-next-line testing-library/no-node-access
    const checkox = checkboxContainer.querySelector('input[type="checkbox"]') as HTMLInputElement;

    expect(checkox).toBeInTheDocument();
    fireEvent.click(checkox);

    const runningTask = screen.getByTestId('running-task');

    expect(runningTask).toBeInTheDocument();
  });
});
