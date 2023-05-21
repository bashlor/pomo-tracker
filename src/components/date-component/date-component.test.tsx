import { beforeAll, describe, expect, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { DateComponent } from './date-component';
import { DayTimeProvider } from '../../@types/app';
import { getDefaultDayTimeProviderConfiguration } from '../../helpers/time';

describe('Date Component', () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('should render the date component', () => {
    const dateProvider = {
      now: () => new Date('2021-01-01T00:00:00.000Z'),
      locales: 'en-US',
      hour12: true,
    };

    render(<DateComponent dayTimeProvider={dateProvider} />);
    const dateComponent = screen.getByTestId('date-component');
    expect(dateComponent).toBeInTheDocument();
  });

  it('should render the date passed as parameter', () => {
    const dateProvider: DayTimeProvider = {
      now: () => new Date('2021-01-01T00:00:00.000Z'),
      locales: 'en-US',
      hour12: true,
    };

    render(<DateComponent dayTimeProvider={dateProvider} />);
    const dateComponent = screen.getByTestId('date-component-computed-date');

    const computedDate = new Date(dateProvider.now()).toLocaleDateString(dateProvider.locales, {
      weekday: 'long',
    });

    const computedTime = new Date(dateProvider.now()).toLocaleTimeString(dateProvider.locales, {
      hour: 'numeric',
      minute: 'numeric',
      hour12: dateProvider.hour12,
    });

    const computedDateAndTime = `${computedDate}, ${computedTime}`;

    const expectedDateTextFromComponent = dateComponent.textContent?.toString();

    expect(expectedDateTextFromComponent).toStrictEqual(computedDateAndTime);
  });

  it('should update the date when the date changes', () => {
    const dateProvider = getDefaultDayTimeProviderConfiguration();

    render(<DateComponent dayTimeProvider={dateProvider} />);

    const dateComponent = screen.getByTestId('date-component-computed-date');

    const dateFromTextComponent = dateComponent.textContent?.toString();

    act(() => {
      vi.advanceTimersByTime(60 * 1000);
      vi.advanceTimersToNextTimer();
    });

    const newExpectedDateTextFromComponent = dateComponent.textContent?.toString();

    if (!newExpectedDateTextFromComponent || !dateFromTextComponent) throw new Error('text from Date Component is not defined');

    expect(dateFromTextComponent < newExpectedDateTextFromComponent).toBeTruthy();
  });
});
