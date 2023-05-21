import { describe, expect } from 'vitest';
import { ApplicationData } from '../@types/app';
import { getDefaultApplicationData } from './application';
import { nanoid } from 'nanoid';

describe('application helper', () => {
  it('should return the default application data object', () => {
    const applicationData: ApplicationData = {
      sequenceIndex: 0,
      timerMode: 'work',
      pomodoroSequences: [],
      currentTaskName: 'My work session',
      currentSequenceId: nanoid(),
      tasks: [],
      version: import.meta.env.VITE_APP_VERSION as string,
    };

    expect(getDefaultApplicationData()).toMatchObject({
      ...applicationData,
      currentSequenceId: expect.stringMatching(/^[a-zA-Z0-9_-]{21}$/),
    });
  });
});
