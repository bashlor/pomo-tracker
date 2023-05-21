import { createContext, ReactNode } from 'react';
import { DayTimeProvider } from '../@types/app';
import { getDefaultDayTimeProviderConfiguration } from '../helpers/time';

export const DayTimeContext = createContext<DayTimeProvider>(getDefaultDayTimeProviderConfiguration());

export const DayTimeContextProvider = ({ children, dayTimeProvider }: { children: ReactNode; dayTimeProvider?: DayTimeProvider }) => {
  return <DayTimeContext.Provider value={dayTimeProvider || getDefaultDayTimeProviderConfiguration()}>{children}</DayTimeContext.Provider>;
};
