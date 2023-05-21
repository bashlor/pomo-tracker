import { ApplicationData } from '../@types/app';
import { nanoid } from 'nanoid';
export const persistentApplicationDataKey = 'pomo-tracker-app';

export function getDefaultApplicationData(): ApplicationData {
  return {
    sequenceIndex: 0,
    timerMode: 'work',
    pomodoroSequences: [],
    currentTaskName: 'My work session',
    currentSequenceId: nanoid(),
    tasks: [],
    version: import.meta.env.VITE_APP_VERSION as string,
  };
}
