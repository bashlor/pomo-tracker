import { DayTimeProvider } from '../../@types/app';
import { useEffect, useState } from 'react';
import { Box, Text } from 'grommet';

export function DateComponent({ dayTimeProvider }: { dayTimeProvider: DayTimeProvider }) {
  const [computedDate, setComputedDate] = useState(() => {
    const localDay = dayTimeProvider.now().toLocaleDateString(dayTimeProvider.locales, { weekday: 'long' });
    const localTime = dayTimeProvider
      .now()
      .toLocaleTimeString(dayTimeProvider.locales, { hour: 'numeric', minute: 'numeric', hour12: dayTimeProvider.hour12 });
    return `${localDay}, ${localTime}`;
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      const localDay = dayTimeProvider.now().toLocaleDateString(dayTimeProvider.locales, { weekday: 'long' });
      const localTime = dayTimeProvider
        .now()
        .toLocaleTimeString(dayTimeProvider.locales, { hour: 'numeric', minute: 'numeric', hour12: dayTimeProvider.hour12 });
      const newComputedDate = `${localDay}, ${localTime}`;
      setComputedDate(newComputedDate);
    }, 10_000);
    return () => clearInterval(intervalId);
  }, [dayTimeProvider.now()]);

  return (
    <Box pad="small" gap="medium" data-testid="date-component">
      <Text textAlign="center" data-testid="date-component-computed-date">
        {computedDate}
      </Text>
    </Box>
  );
}
