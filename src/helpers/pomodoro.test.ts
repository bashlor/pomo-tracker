import { afterEach, describe, expect } from 'vitest';
import { Settings } from '../@types/settings';
import {
  computeTotalTimeInPomodoroSequence,
  getCurrentSessionData,
  getLongBreakDurationInSeconds,
  returnApplicationDataWithNextSequence,
  getShortBreakDurationInSeconds,
  getTimerModeLabel,
  getWorkDurationInSeconds,
  getWorkedTimeTodayInSeconds,
  singleCharModeToTimerMode,
  timerModeToDurationInSeconds,
  nextTimerMode,
} from './pomodoro';
import { ApplicationData, DayTimeProvider, PomodoroSequence, SessionData, TimerModeType, TimerModeTypeObject } from '../@types/app';
import { persistentApplicationDataKey } from './application';
import { nanoid } from 'nanoid';

describe('pomodoro helper', () => {
  afterEach(() => {
    localStorage.clear();
  });

  describe('getShortBreakDurationInSeconds', () => {
    it('should return the short break duration in seconds based on settings object', () => {
      const settings: Settings = {
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        sequence: 'W B L',
        autoStartNextSequence: false,
        soundName: 'bell',
        soundVolume: 0,
        notifyBeforeTimerEnds: false,
        notifyBeforeTimerEndsDuration: 0,
      };

      expect(getShortBreakDurationInSeconds(settings)).toBe(300);
    });
  });

  describe('getLongBreakDurationInSeconds', () => {
    it('should return the long break duration in seconds based on settings object', () => {
      const settings: Settings = {
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        sequence: 'W B L',
        autoStartNextSequence: false,
        soundName: 'bell',
        soundVolume: 0,
        notifyBeforeTimerEnds: false,
        notifyBeforeTimerEndsDuration: 0,
      };

      expect(getLongBreakDurationInSeconds(settings)).toBe(900);
    });
  });

  describe('getWorkDurationInSeconds', () => {
    it('should return the work duration in seconds based on settings object', () => {
      const settings: Settings = {
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        sequence: 'W B L',
        autoStartNextSequence: false,
        soundName: 'bell',
        soundVolume: 0,
        notifyBeforeTimerEnds: false,
        notifyBeforeTimerEndsDuration: 0,
      };

      expect(getWorkDurationInSeconds(settings)).toBe(1500);
    });
  });

  describe('singleCharModeToTimerMode', () => {
    it('should return the correct timer mode based on the first character of timer mode word', () => {
      expect(singleCharModeToTimerMode('W').unwrapOr(null)).toBe('work');
      expect(singleCharModeToTimerMode('B').unwrapOr(null)).toBe('shortBreak');
      expect(singleCharModeToTimerMode('L').unwrapOr(null)).toBe('longBreak');
    });

    it('should return an error result if the first character is not W, B, or L', () => {
      // @ts-expect-error - we are testing the error case
      expect(() => singleCharModeToTimerMode('A').isErr()).toBeTruthy();
    });
  });

  describe('getTimerModeLabel', () => {
    it('should return the correct label for the timer mode', () => {
      expect(getTimerModeLabel('work')._unsafeUnwrap()).toBe('Work');
      expect(getTimerModeLabel('shortBreak')._unsafeUnwrap()).toBe('Short Break');
      expect(getTimerModeLabel('longBreak')._unsafeUnwrap()).toBe('Long Break');
    });

    it('should return an error object if the timer mode is not work, shortBreak, or longBreak', () => {
      // @ts-expect-error - we are testing the error case
      expect(() => getTimerModeLabel('A').isErr()).toBeTruthy();
    });
  });

  describe('returnApplicationDataWithNextSequence', () => {
    it('should return the next timer mode based on the application data, with his index', () => {
      const settings: Settings = {
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        sequence: 'W B L',
        autoStartNextSequence: false,
        soundName: 'bell',
        soundVolume: 0,
        notifyBeforeTimerEnds: false,
        notifyBeforeTimerEndsDuration: 0,
      };

      const applicationData: ApplicationData = {
        timerMode: 'work',
        sequenceIndex: 0,
        pomodoroSequences: [],
        currentTaskName: 'default',
        currentSequenceId: nanoid(),
        tasks: [],
        version: import.meta.env.VITE_APP_VERSION as string,
      };

      const lastSessionStartDate = new Date(2023, 1, 1, 10, 30);
      const lastSessionEndDate = new Date(2023, 1, 1, 10, 55);

      const nextSequence = returnApplicationDataWithNextSequence(
        settings,
        applicationData,
        lastSessionStartDate,
        lastSessionEndDate,
        false
      )._unsafeUnwrap();

      //retrieve the current session data and check if returnApplicationDataWithNextSequence has updated the pomodoroSequences array
      const currentSessionData: SessionData = getCurrentSessionData(settings, applicationData, lastSessionStartDate, lastSessionEndDate);

      const newPomodoroSequence: PomodoroSequence = {
        id: applicationData.currentSequenceId,
        sequence: 'W B L',
        sessions: [currentSessionData],
        taskName: 'default',
      };

      //check if the application data has been updated
      expect(nextSequence).toMatchObject({
        timerMode: 'shortBreak',
        sequenceIndex: 1,
        pomodoroSequences: expect.any(Array),
        currentTaskName: 'default',
        currentSequenceId: applicationData.currentSequenceId,
      });

      //check if the pomodoroSequences array has been updated
      expect(nextSequence.pomodoroSequences).toHaveLength(1);
      expect(nextSequence.pomodoroSequences[0]).toMatchObject({
        id: newPomodoroSequence.id,
        sequence: newPomodoroSequence.sequence,
        sessions: expect.any(Array),
        taskName: 'default',
      });

      expect(nextSequence.pomodoroSequences[0].sessions).toHaveLength(1);
      expect(nextSequence.pomodoroSequences[0].sessions[0]).toMatchObject({
        id: expect.stringMatching(/^[a-zA-Z0-9_-]{21}$/),
        startDate: currentSessionData.startDate,
        endDate: currentSessionData.endDate,
        timerMode: currentSessionData.timerMode,
      });
    });

    it('should loop back to the first timer mode if the sequence index is at the end of the sequence', () => {
      const settings: Settings = {
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        sequence: 'W B L',
        autoStartNextSequence: false,
        soundName: 'bell',
        soundVolume: 0,
        notifyBeforeTimerEnds: false,
        notifyBeforeTimerEndsDuration: 0,
      };

      const applicationData: ApplicationData = {
        timerMode: 'longBreak',
        sequenceIndex: 2,
        pomodoroSequences: [],
        currentTaskName: 'default',
        currentSequenceId: nanoid(),
        tasks: [],
        version: import.meta.env.VITE_APP_VERSION as string,
      };

      const lastSessionStartDate = new Date(2023, 1, 1, 10, 30);
      const lastSessionEndDate = new Date(2023, 1, 1, 10, 55);

      const nextSequenceResult = returnApplicationDataWithNextSequence(
        settings,
        applicationData,
        lastSessionStartDate,
        lastSessionEndDate,
        false
      );
      const nextSequence = nextSequenceResult._unsafeUnwrap();

      expect(nextSequence).toMatchObject({
        timerMode: 'work',
        sequenceIndex: 0,
        pomodoroSequences: expect.any(Array),
        currentTaskName: 'default',
        currentSequenceId: applicationData.currentSequenceId,
      });

      expect(nextSequence.pomodoroSequences).toHaveLength(1);
      expect(nextSequence.pomodoroSequences[0].sessions).toHaveLength(1);
    });

    it('should use the same sequence id if the sequenceId already exists', () => {
      const settings: Settings = {
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        sequence: 'W B L',
        autoStartNextSequence: false,
        soundName: 'bell',
        soundVolume: 0,
        notifyBeforeTimerEnds: false,
        notifyBeforeTimerEndsDuration: 0,
      };

      const savedSequenceId = nanoid();

      const applicationData: ApplicationData = {
        timerMode: 'shortBreak',
        sequenceIndex: 1,
        currentSequenceId: savedSequenceId,
        pomodoroSequences: [
          {
            id: savedSequenceId,
            sequence: 'W B L',
            sessions: [
              {
                id: nanoid(),
                startDate: new Date(2023, 1, 1, 10, 30),
                endDate: new Date(2023, 1, 1, 10, 55),
                timerMode: 'work',
                sequence: {
                  index: 0,
                  cycle: 'W B L',
                },
              },
            ],
            taskName: 'default',
          },
        ],
        currentTaskName: 'default',
        tasks: [],
        version: import.meta.env.VITE_APP_VERSION as string,
      };

      const lastSessionStartDate = new Date(2023, 1, 1, 10, 55);
      const lastSessionEndDate = new Date(2023, 1, 1, 11, 0);

      const nextSequence = returnApplicationDataWithNextSequence(
        settings,
        applicationData,
        lastSessionStartDate,
        lastSessionEndDate,
        false
      )._unsafeUnwrap();

      expect(nextSequence.pomodoroSequences).toHaveLength(1);
      expect(nextSequence).toMatchObject({
        timerMode: 'longBreak',
        sequenceIndex: 2,
        pomodoroSequences: expect.any(Array),
        currentTaskName: 'default',
        currentSequenceId: savedSequenceId,
      });

      expect(nextSequence.pomodoroSequences[0].sessions).toHaveLength(2);
      expect(nextSequence.pomodoroSequences[0].sessions[1]).toMatchObject({
        id: expect.stringMatching(/^[a-zA-Z0-9_-]{21}$/),
        startDate: lastSessionStartDate,
        endDate: lastSessionEndDate,
        timerMode: 'shortBreak',
        sequence: {
          index: 1,
          cycle: 'W B L',
        },
      });
    });

    it('should create a new sequence id if the startDate day is different from the endDate day', () => {
      const settings: Settings = {
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        sequence: 'W B L',
        autoStartNextSequence: false,
        soundName: 'bell',
        soundVolume: 0,
        notifyBeforeTimerEnds: false,
        notifyBeforeTimerEndsDuration: 0,
      };

      const savedSequenceId = nanoid();

      const applicationData: ApplicationData = {
        timerMode: 'shortBreak',
        sequenceIndex: 1,
        currentSequenceId: savedSequenceId,
        pomodoroSequences: [
          {
            id: savedSequenceId,
            sequence: 'W B L',
            sessions: [
              {
                id: nanoid(),
                startDate: new Date(2023, 1, 1, 10, 30),
                endDate: new Date(2023, 1, 1, 10, 55),
                timerMode: 'work',
                sequence: {
                  index: 0,
                  cycle: 'W B L',
                },
              },
            ],
            taskName: 'default',
          },
        ],
        currentTaskName: 'default',
        tasks: [],
        version: import.meta.env.VITE_APP_VERSION as string,
      };

      const lastSessionStartDate = new Date(2023, 1, 2, 23, 55);
      const lastSessionEndDate = new Date(2023, 1, 3, 0, 20);

      const nextSequence = returnApplicationDataWithNextSequence(
        settings,
        applicationData,
        lastSessionStartDate,
        lastSessionEndDate,
        false
      )._unsafeUnwrap();

      expect(nextSequence.pomodoroSequences).toHaveLength(1);

      expect(nextSequence.pomodoroSequences[0].sessions).toHaveLength(2);
      expect(nextSequence.pomodoroSequences[0].sessions[1]).toMatchObject({
        id: expect.stringMatching(/^[a-zA-Z0-9_-]{21}$/),
        startDate: lastSessionStartDate,
        endDate: lastSessionEndDate,
        timerMode: 'shortBreak',
        sequence: {
          index: 1,
          cycle: 'W B L',
        },
      });
    });
  });

  describe('timerModeToDurationInSeconds', () => {
    it('should return the correct duration for the timer mode', () => {
      const settings: Settings = {
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        sequence: 'W B L',
        autoStartNextSequence: false,
        soundName: 'bell',
        soundVolume: 0,
        notifyBeforeTimerEnds: false,
        notifyBeforeTimerEndsDuration: 0,
      };

      const timerMode1: TimerModeType = 'work';
      const timerMode2: TimerModeType = 'shortBreak';
      const timerMode3: TimerModeType = 'longBreak';

      expect(timerModeToDurationInSeconds(settings, timerMode1)).toBe(1500);
      expect(timerModeToDurationInSeconds(settings, timerMode2)).toBe(300);
      expect(timerModeToDurationInSeconds(settings, timerMode3)).toBe(900);
    });

    it('should throw an error if the timer mode is not work, shortBreak, or longBreak', () => {
      const settings: Settings = {
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        sequence: 'W B L',
        autoStartNextSequence: false,
        soundName: 'bell',
        soundVolume: 0,
        notifyBeforeTimerEnds: false,
        notifyBeforeTimerEndsDuration: 0,
      };

      const timerMode: TimerModeType = 'A' as TimerModeType;
      expect(() => timerModeToDurationInSeconds(settings, timerMode)).toThrow();
    });
  });

  describe('getCurrentSessionData', () => {
    it('should return the current session data', () => {
      const settings: Settings = {
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        sequence: 'W B L',
        autoStartNextSequence: false,
        soundName: 'bell',
        soundVolume: 0,
        notifyBeforeTimerEnds: false,
        notifyBeforeTimerEndsDuration: 0,
      };

      const applicationData: ApplicationData = {
        timerMode: 'work',
        sequenceIndex: 0,
        pomodoroSequences: [],
        currentTaskName: 'Default',
        currentSequenceId: nanoid(),
        tasks: [],
        version: import.meta.env.VITE_APP_VERSION as string,
      };

      const startDate = new Date(2022, 1, 1, 6, 30);
      const endDate = new Date(2022, 1, 1, 6, 55);

      const currentSessionData = getCurrentSessionData(settings, applicationData, startDate, endDate);

      expect(currentSessionData).toEqual({
        id: expect.stringMatching(/^[a-zA-Z0-9_-]{21}$/), // matches nanoid id default format
        timerMode: 'work',
        startDate: startDate,
        endDate: endDate,
        sequence: {
          index: 0,
          cycle: 'W B L',
        },
      });
    });
  });

  describe('computeTotalTimeInPomodoroSequence', () => {
    it('should return the correct total time for the pomodoro sequence', () => {
      const pomodoroSequence: PomodoroSequence = {
        id: nanoid(),
        sequence: 'W B L',
        sessions: [
          {
            id: nanoid(),
            timerMode: 'work',
            startDate: new Date(2022, 1, 1, 6, 30),
            endDate: new Date(2022, 1, 1, 6, 55),
            sequence: {
              index: 0,
              cycle: 'W B L',
            },
          },
          {
            id: nanoid(),
            timerMode: 'shortBreak',
            startDate: new Date(2022, 1, 1, 6, 55),
            endDate: new Date(2022, 1, 1, 7, 0),
            sequence: {
              index: 1,
              cycle: 'W B L',
            },
          },
        ],
        taskName: 'Default',
      };

      const totalTime = computeTotalTimeInPomodoroSequence(pomodoroSequence);

      expect(totalTime).toBe(1800);
    });
  });

  describe('getWorkedTimeTodayInSeconds', () => {
    it('should return the correct worked time today in seconds', () => {
      const pomodoroSequence: PomodoroSequence = {
        id: nanoid(),
        sequence: 'W B L',
        sessions: [],
        taskName: 'Default',
      };

      const applicationData: ApplicationData = {
        timerMode: 'work',
        sequenceIndex: 0,
        pomodoroSequences: [pomodoroSequence],
        currentTaskName: 'Default',
        currentSequenceId: nanoid(),
        tasks: [],
        version: import.meta.env.VITE_APP_VERSION as string,
      };

      const startDate = new Date(2022, 1, 1, 6, 30);
      const endDate = new Date(2022, 1, 1, 6, 55);

      const dayTimeProvider: DayTimeProvider = {
        now: () => startDate,
        locales: 'en-US',
        hour12: true,
      };

      const currentSessionData: SessionData = {
        id: nanoid(),
        timerMode: 'work',
        startDate: startDate,
        endDate: endDate,
        sequence: {
          index: 0,
          cycle: 'W B L',
        },
      };

      pomodoroSequence.sessions.push(currentSessionData);

      const workedTimeTodayInSeconds = getWorkedTimeTodayInSeconds(applicationData, dayTimeProvider);
      expect(workedTimeTodayInSeconds).toBe(1500);
    });
  });

  describe('nextTimerMode', () => {
    it('should return the correct next timer mode', () => {
      const settings: Settings = {
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        sequence: 'W B L',
        autoStartNextSequence: false,
        soundName: 'bell',
        soundVolume: 0,
        notifyBeforeTimerEnds: false,
        notifyBeforeTimerEndsDuration: 0,
      };

      const applicationData: ApplicationData = {
        timerMode: 'work',
        sequenceIndex: 0,
        pomodoroSequences: [],
        currentTaskName: 'Default',
        currentSequenceId: nanoid(),
        tasks: [],
        version: import.meta.env.VITE_APP_VERSION as string,
      };

      expect(nextTimerMode(settings, applicationData)._unsafeUnwrap()).toBe(TimerModeTypeObject.enum.shortBreak);
    });
  });

  describe('persistentApplicationDataKey', () => {
    it('should return the correct key', function () {
      expect(persistentApplicationDataKey).toBe(persistentApplicationDataKey);
    });
  });
});
