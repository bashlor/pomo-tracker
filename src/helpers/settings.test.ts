import { describe } from 'vitest';
import { getDefaultSettings, persistantSettingsKey } from './settings';

describe('Settings helper', () => {
  it('should return the default settings object', () => {
    expect(getDefaultSettings()).toEqual({
      workDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      sequence: 'W B W L',
      autoStartNextSequence: false,
      soundName: 'bell',
      soundVolume: 0,
      notifyBeforeTimerEnds: false,
      notifyBeforeTimerEndsDuration: 0,
    });
  });

  it('should get the persistent settings key', () => {
    expect(persistantSettingsKey).toBe('pomo-tracker-settings');
  });
});
