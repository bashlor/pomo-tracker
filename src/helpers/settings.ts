import { Settings } from '../@types/settings';

export const persistantSettingsKey = 'pomo-tracker-settings';

export function getDefaultSettings(): Settings {
  return {
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
}
