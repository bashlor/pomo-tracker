import { describe } from 'vitest';
import { DayTimeContext, DayTimeContextProvider } from './daytime-provider-context';
import { render, screen } from '@testing-library/react';
import { useContext } from 'react';

const DummyDateComponent = () => {
  const dayTimeProvider = useContext(DayTimeContext);
  return (
    <>
      <p data-testid="dummy-now">{dayTimeProvider.now().toISOString()}</p>
      <p data-testid="dummy-locales">{dayTimeProvider.locales}</p>
      <p data-testid="dummy-hour12">{dayTimeProvider.hour12 ? 'true' : 'false'}</p>
    </>
  );
};

describe('DayTimeProviderContext', () => {
  it('DayTimeContextProvider should be defined', () => {
    expect(DayTimeContextProvider).toBeDefined();
  });

  it('DayTimeContextProvider can be overloaded with a specific dayTimeProvider passed as a prop', () => {
    const now = () => new Date('2021-01-01T00:00:00.000Z');
    render(
      <DayTimeContextProvider dayTimeProvider={{ now, locales: 'fr', hour12: false }}>
        <DummyDateComponent />
      </DayTimeContextProvider>
    );

    const nowFromDummyDateComponent = screen.getByTestId('dummy-now').textContent;
    const localesFromDummyDateComponent = screen.getByTestId('dummy-locales').textContent;
    const hour12FromDummyDateComponent = screen.getByTestId('dummy-hour12').textContent;

    expect(nowFromDummyDateComponent).toBe(now().toISOString());
    expect(localesFromDummyDateComponent).toBe('fr');
    expect(hour12FromDummyDateComponent).toBe('false');
  });

  it('DayTimeContextProvider should load default configuration if no dayTimeProvider is passed as a prop', () => {
    render(
      <DayTimeContextProvider>
        <DummyDateComponent />
      </DayTimeContextProvider>
    );

    const parsedDateString = new Date(Date.now()).toISOString().split('T')[0];

    const nowFromDummyDateComponent = screen.getByTestId('dummy-now').textContent;
    const localesFromDummyDateComponent = screen.getByTestId('dummy-locales').textContent;
    const hour12FromDummyDateComponent = screen.getByTestId('dummy-hour12').textContent;

    expect(nowFromDummyDateComponent?.includes(parsedDateString)).toBeTruthy();
    expect(localesFromDummyDateComponent).toBe(navigator.language);
    expect(hour12FromDummyDateComponent).toBe('true');
  });
});
