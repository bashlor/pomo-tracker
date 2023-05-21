import { afterEach, beforeEach, describe, expect, vi } from 'vitest';
import { PomodoroTimer } from './pomodoro-timer';
import { fireEvent, render, screen } from '@testing-library/react';
import { computeTimerText } from '../../helpers/time';
import { act } from 'react-dom/test-utils';
import { getDefaultApplicationData, persistentApplicationDataKey } from '../../helpers/application';
import { getDefaultSettings, persistantSettingsKey } from '../../helpers/settings';
import { ApplicationData, SessionData, TimerModeTypeObject } from '../../@types/app';

describe('Pomodoro Timer', () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('should render the pomodoro timer', () => {
    render(<PomodoroTimer initialTime={100} linkSessionToTask={false} />);
    const pomodoroTimer = screen.getByTestId('pomodoro-timer');
    expect(pomodoroTimer).toBeInTheDocument();
  });

  it('pomodoro timer should take the time as parameter, and display it in mm:00', () => {
    render(<PomodoroTimer linkSessionToTask={false} initialTime={1800} />);
    const pomodoroTimer = screen.getByTestId('pomodoro-timer');
    expect(pomodoroTimer).toHaveTextContent('30:00');
  });

  it('should display the time in mm:ss, adding extra an 0 if minutes < 10 or seconds < 10', () => {
    render(<PomodoroTimer linkSessionToTask={false} initialTime={61} />);
    const pomodoroTimer = screen.getByTestId('pomodoro-timer');
    expect(pomodoroTimer).toHaveTextContent('01:01');
  });

  it('should render the pomodoro timer controls buttons section', () => {
    render(<PomodoroTimer linkSessionToTask={false} initialTime={100} />);
    const pomodoroTimerControls = screen.getByTestId('pomodoro-controls');
    expect(pomodoroTimerControls).toBeInTheDocument();
  });

  it('should render the start button', () => {
    render(<PomodoroTimer linkSessionToTask={false} initialTime={100} />);
    const startButton = screen.getByTestId('pomodoro-start-button');
    expect(startButton).toBeInTheDocument();
  });

  it('should render the stop button', () => {
    render(<PomodoroTimer linkSessionToTask={false} initialTime={100} />);
    const stopButton = screen.getByTestId('pomodoro-stop-button');
    expect(stopButton).toBeInTheDocument();
  });

  it('click on start button should start the countdown', () => {
    let remainingTimer = 100;
    render(<PomodoroTimer linkSessionToTask={false} initialTime={remainingTimer} />);
    const startButton = screen.getByTestId('pomodoro-start-button');
    const timerElement = screen.getByTestId('pomodoro-timer');

    fireEvent.click(startButton);
    while (remainingTimer > 1) {
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      remainingTimer--;
      expect(timerElement).toHaveTextContent(computeTimerText(remainingTimer));
    }
  });

  it('click on stop button should stop and reset the countdown', () => {
    const remainingTimer = 100;
    render(<PomodoroTimer linkSessionToTask={false} initialTime={remainingTimer} />);
    const startButton = screen.getByTestId('pomodoro-start-button');
    const stopButton = screen.getByTestId('pomodoro-stop-button');
    const timerElement = screen.getByTestId('pomodoro-timer');

    fireEvent.click(startButton);

    // eslint-disable-next-line testing-library/no-unnecessary-act
    act(() => {
      vi.advanceTimersByTime(1000);
      fireEvent.click(stopButton);
      vi.advanceTimersByTime(10000);
    });

    expect(timerElement).toHaveTextContent(computeTimerText(remainingTimer));
  });

  it('click on the start button once the timer has been started and stopped should resume the countdown', () => {
    const remainingTimer = 100;
    render(<PomodoroTimer linkSessionToTask={false} initialTime={remainingTimer} />);
    const startButton = screen.getByTestId('pomodoro-start-button');
    const timerElement = screen.getByTestId('pomodoro-timer');

    fireEvent.click(startButton);

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    const timerText = timerElement.textContent || '';

    fireEvent.click(startButton);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(timerElement).toHaveTextContent(timerText);
  });

  it('should not reach 0', () => {
    const remainingTimer = 1;
    render(<PomodoroTimer linkSessionToTask={false} initialTime={remainingTimer} />);
    const startButton = screen.getByTestId('pomodoro-start-button');
    const timerElement = screen.getByTestId('pomodoro-timer');

    fireEvent.click(startButton);
    act(() => {
      vi.advanceTimersToNextTimer();
    });
    expect(timerElement).toHaveTextContent(computeTimerText(1));
  });

  describe('session saving with local storage', () => {
    beforeEach(() => {
      localStorage.setItem(persistentApplicationDataKey, JSON.stringify(getDefaultApplicationData()));
      localStorage.setItem(persistantSettingsKey, JSON.stringify(getDefaultSettings()));
    });

    afterEach(() => {
      localStorage.clear();
    });

    it('should save the work session data', () => {
      const remainingTimer = getDefaultSettings().workDuration * 60;
      render(<PomodoroTimer linkSessionToTask={false} initialTime={remainingTimer} />);
      const startButton = screen.getByTestId('pomodoro-start-button');

      fireEvent.click(startButton);

      act(() => {
        vi.advanceTimersByTime(remainingTimer * 1000);
      });

      const newApplicationData: ApplicationData = JSON.parse(localStorage.getItem(persistentApplicationDataKey) || '{}');
      const pomodoroSequences = newApplicationData.pomodoroSequences;
      const sessionsArray = pomodoroSequences[0].sessions || [];

      expect(pomodoroSequences.length).toBe(1);
      expect(sessionsArray.length).toBe(1);

      const sessionDataFromJson = sessionsArray[0];

      // A conversion is needed or the test will fail
      const sessionDataObject: SessionData = {
        id: sessionDataFromJson.id,
        timerMode: sessionDataFromJson.timerMode,
        startDate: new Date(sessionDataFromJson.startDate),
        endDate: new Date(sessionDataFromJson.endDate),
        sequence: {
          index: sessionDataFromJson.sequence.index,
          cycle: sessionDataFromJson.sequence.cycle,
        },
      };

      expect(sessionDataObject).toMatchObject({
        id: expect.stringMatching(/^[a-zA-Z0-9_-]{21}$/),
        timerMode: TimerModeTypeObject.enum.work,
        startDate: expect.any(Date),
        endDate: expect.any(Date),
        sequence: {
          index: 0,
          cycle: 'W B W L',
        },
      });
    });
  });

  describe('sequenceId should be reset at certain conditions', () => {
    //If the timer has been reset, the sequenceId should be reset

    beforeEach(() => {
      localStorage.setItem(persistentApplicationDataKey, JSON.stringify(getDefaultApplicationData()));
      localStorage.setItem(persistantSettingsKey, JSON.stringify(getDefaultSettings()));
    });

    afterEach(() => {
      localStorage.clear();
    });

    it('should reset the sequenceId if the timer has been reset', async () => {
      const appDataRawString = localStorage.getItem(persistentApplicationDataKey) || '{}';
      const previousSequenceId = (JSON.parse(appDataRawString) as ApplicationData).currentSequenceId;

      const remainingTimer = getDefaultSettings().workDuration * 60;
      render(<PomodoroTimer linkSessionToTask={false} initialTime={remainingTimer} />);
      const startButton = screen.getByTestId('pomodoro-start-button');
      const stopButton = screen.getByTestId('pomodoro-stop-button');

      // start and reset the timer
      fireEvent.click(startButton);
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      fireEvent.click(stopButton);

      const newSequenceId = (JSON.parse(localStorage.getItem(persistentApplicationDataKey) || '{}') as ApplicationData).currentSequenceId;
      expect(newSequenceId).match(/^[a-zA-Z0-9_-]{21}$/);
      expect(newSequenceId).not.toBe(previousSequenceId);
    });
  });
});
