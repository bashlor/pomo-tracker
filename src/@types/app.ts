import { z } from 'zod';

export const TimerModeTypeObject = z.enum(['work', 'shortBreak', 'longBreak']);
export const TimerModeCharTypeObject = z.enum(['W', 'B', 'L']);

export const SessionDataTypeObject = z.object({
  id: z.string(),
  timerMode: TimerModeTypeObject,
  startDate: z.date(),
  endDate: z.date(),
  sequence: z.object({
    index: z.number(),
    cycle: z.string(),
  }),
});

export const PomodoroSequenceTypeObject = z.object({
  id: z.string(),
  sequence: z.string(),
  sessions: z.array(SessionDataTypeObject),
  taskName: z.string(),
});

export const ApplicationDataTypeObject = z.object({
  sequenceIndex: z.number(),
  timerMode: TimerModeTypeObject,
  pomodoroSequences: z.array(PomodoroSequenceTypeObject),
  currentTaskName: z.string(),
  currentSequenceId: z.string(),
  tasks: z.array(z.string()),
  version: z.string(),
});

const DayTimeProviderTypeObject = z.object({
  now: z.function().returns(z.date()),
  locales: z.string(),
  hour12: z.boolean(),
});

export type TimerMode = z.infer<typeof TimerModeTypeObject>;
export type TimerModeChar = z.infer<typeof TimerModeCharTypeObject>;

export type TimerModeType = TimerMode;
export type TimerModeCharType = TimerModeChar;

export type ApplicationData = z.infer<typeof ApplicationDataTypeObject>;
export type PomodoroSequence = z.infer<typeof PomodoroSequenceTypeObject>;
export type SessionData = z.infer<typeof SessionDataTypeObject>;

export type DayTimeProvider = z.infer<typeof DayTimeProviderTypeObject>;
