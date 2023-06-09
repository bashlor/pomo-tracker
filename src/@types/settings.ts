import { z } from 'zod';

export const SettingsTypeObject = z.object({
  workDuration: z.number().gte(0).int().refine(value => value >= 0, {
    message: 'The work duration must be a positive integer between 1 and 120.',
  }),
  shortBreakDuration: z.number().gte(0).int().refine(value => value >= 0, {
    message: 'The short break duration must be a positive between 1 and 120.',
  }),
  longBreakDuration: z.number().gte(0).int().refine(value => value >= 0, {
    message: `The long break duration must be a positive between 1 and 120.`
  }),
  sequence: z.string().regex(/^(W|B|L)( (W|B|L))*$/).min(1).refine(value => value.length >= 1, {
    message: 'The sequence must contain at least one timer mode.',
  }),
  autoStartNextSequence: z.boolean(),
  soundName: z.string(),
  soundVolume: z.number().gte(0).lte(100).int().refine(value => value >= 0 && value <= 100, {
    message: 'The sound volume must be an integer between 0 and 100.',
  }),
  notifyBeforeTimerEnds: z.boolean(),
  notifyBeforeTimerEndsDuration: z.number().gte(0).int().refine(value => value >= 0, {
    message: 'The notification duration must be an integer greater than or equal to 0.',
  }),
});

export type Settings = z.infer<typeof SettingsTypeObject>;
