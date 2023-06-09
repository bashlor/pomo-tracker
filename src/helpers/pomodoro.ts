import { Settings } from '../@types/settings';
import {
  ApplicationData,
  DayTimeProvider,
  PomodoroSequence,
  SessionData,
  TimerMode,
  TimerModeCharType,
  TimerModeType,
} from '../@types/app';
import { nanoid } from 'nanoid';
import { err, ok, Result } from 'neverthrow';

export function getShortBreakDurationInSeconds(settings: Settings) {
  return settings.shortBreakDuration * 60;
}

export function getLongBreakDurationInSeconds(settings: Settings) {
  return settings.longBreakDuration * 60;
}

export function getWorkDurationInSeconds(settings: Settings) {
  return settings.workDuration * 60;
}

export function labelToSingleCharMode(label: string): Result<TimerModeCharType, Error> {
  switch (label) {
    case 'Work':
      return ok('W');
    case 'Short Break':
      return ok('B');
    case 'Long Break':
      return ok('L');
    default:
      return err(new Error(`Invalid timer mode ${label}`));
  }
}

export function singleCharModeToTimerMode(mode: TimerModeCharType): Result<TimerModeType, Error> {
  switch (mode) {
    case 'W':
      return ok('work');
    case 'B':
      return ok('shortBreak');
    case 'L':
      return ok('longBreak');
    default:
      return err(new Error(`Invalid timer mode ${mode}`));
  }
}

export function getTimerModeLabel(mode: TimerModeType): Result<string, Error> {
  switch (mode) {
    case 'work':
      return ok('Work');
    case 'shortBreak':
      return ok('Short Break');
    case 'longBreak':
      return ok('Long Break');
    default:
      return err(new Error(`unknown timer mode: ${mode}`));
  }
}

export function returnApplicationDataWithNextSequence(
  settings: Settings,
  applicationData: ApplicationData,
  lastSessionStartDate: Date,
  lastSessionEndDate: Date,
  linkSessionToTask: boolean
): Result<ApplicationData, Error> {
  const sequence = settings.sequence.split(' ');
  const sequenceIndex = (applicationData.sequenceIndex + 1) % sequence.length;
  const timerModeResult = singleCharModeToTimerMode(sequence[sequenceIndex] as TimerModeCharType);

  if (timerModeResult.isErr()) {
    const error = new Error(`failed to convert timer mode char to timer mode ${sequence[sequenceIndex]}`);
    return err(error);
  }

  const currentSessionData = getCurrentSessionData(settings, applicationData, lastSessionStartDate, lastSessionEndDate);

  const needToRegenerateSequenceId = lastSessionStartDate.getDate() < lastSessionEndDate.getDate();

  const sequenceFound = applicationData.pomodoroSequences.find(
    (pomodoroSequence: PomodoroSequence) => pomodoroSequence.id === applicationData.currentSequenceId
  );

  const newApplicationData = {
    sequenceIndex,
    timerMode: timerModeResult.value,
    pomodoroSequences: applicationData.pomodoroSequences,
    currentTaskName: applicationData.currentTaskName,
    currentSequenceId: applicationData.currentSequenceId,
    tasks: linkSessionToTask ? [...new Set([...applicationData.tasks, applicationData.currentTaskName])] : applicationData.tasks,
    version: import.meta.env.VITE_APP_VERSION,
  };

  if (!sequenceFound) {
    const newSequence: PomodoroSequence = {
      id: needToRegenerateSequenceId ? nanoid() : applicationData.currentSequenceId,
      sequence: settings.sequence,
      sessions: [currentSessionData],
      taskName: applicationData.currentTaskName,
    };

    newApplicationData.pomodoroSequences.push(newSequence);
    return ok(newApplicationData);
  }

  sequenceFound.sessions.push(currentSessionData);
  newApplicationData.pomodoroSequences = [...applicationData.pomodoroSequences];

  return ok(newApplicationData);
}

export function timerModeToDurationInSeconds(settings: Settings, timerMode: TimerModeType) {
  switch (timerMode) {
    case 'work':
      return getWorkDurationInSeconds(settings);
    case 'shortBreak':
      return getShortBreakDurationInSeconds(settings);
    case 'longBreak':
      return getLongBreakDurationInSeconds(settings);
    default:
      throw new Error(`Invalid timer mode ${timerMode}`);
  }
}

export function getCurrentSessionData(
  settings: Settings,
  applicationData: ApplicationData,
  lastSessionStartDate: Date,
  lastSessionEndDate: Date
): SessionData {
  return {
    id: nanoid(),
    timerMode: applicationData.timerMode,
    startDate: lastSessionStartDate,
    endDate: lastSessionEndDate,
    sequence: {
      index: applicationData.sequenceIndex,
      cycle: settings.sequence,
    },
  };
}

export function getWorkedTimeTodayInSeconds(applicationData: ApplicationData, dayTimeProvider: DayTimeProvider): number {
  const today = dayTimeProvider.now();

  const todaySessions = applicationData.pomodoroSequences.filter((pomodoroSequence) => {
    return pomodoroSequence.sessions.some((session) => {
      return (
        session.startDate.getDate() === today.getDate() &&
        session.startDate.getMonth() === today.getMonth() &&
        session.startDate.getFullYear() === today.getFullYear()
      );
    });
  });

  return todaySessions.reduce((total, pomodoroSequence) => {
    total += computeTotalTimeInPomodoroSequence(pomodoroSequence);
    return total;
  }, 0);
}

export function computeTotalTimeInPomodoroSequence(pomodoroSequence: PomodoroSequence) {
  return pomodoroSequence.sessions.reduce((total, session) => {
    total += (session.endDate.getTime() - session.startDate.getTime()) / 1000;
    return total;
  }, 0);
}

export function nextTimerMode(settings: Settings, applicationData: ApplicationData): Result<TimerModeType, Error> {
  const sequence = settings.sequence.split(' ');
  const sequenceIndex = (applicationData.sequenceIndex + 1) % sequence.length;
  const timerModeResult = singleCharModeToTimerMode(sequence[sequenceIndex] as TimerModeCharType);
  if (timerModeResult.isErr()) {
    return err(timerModeResult.error);
  }
  return ok(timerModeResult.value);
}

export function sequenceFromSettingsToTimerMode(settings: Settings): Result<TimerMode[], Error> {
  const sequence = settings.sequence.split(' ');
  const timerModes: TimerModeType[] = [];
  for (const mode of sequence) {
    const timerModeResult = singleCharModeToTimerMode(mode as TimerModeCharType);
    if (timerModeResult.isErr()) {
      return err(timerModeResult.error);
    }
    timerModes.push(timerModeResult.value);
  }
  return ok(timerModes);
}

export function getActiveColorThemeBasedOnTimerMode(timerMode: TimerMode) {
  switch (timerMode) {
    case 'work':
      return 'red';
    case 'shortBreak':
      return 'green';
    case 'longBreak':
      return 'blue';
  }
}
