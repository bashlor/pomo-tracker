import { z } from 'zod';

export const SettingsTypeObject = z.object({
  workDuration: z.number().gte(0).int(),
  shortBreakDuration: z.number().gte(0).int(),
  longBreakDuration: z.number().gte(0).int(),
  sequence: z.string().regex(/^(W|B|L)( (W|B|L))*$/),
  autoStartNextSequence: z.boolean(),
  soundName: z.string(),
  soundVolume: z.number().gte(0).lte(100).int(),
  notifyBeforeTimerEnds: z.boolean(),
  notifyBeforeTimerEndsDuration: z.number().gte(0).int(),
});

export type Settings = z.infer<typeof SettingsTypeObject>;
