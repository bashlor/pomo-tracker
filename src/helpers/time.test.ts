import { describe, expect } from 'vitest';
import {
  computeTextSeconds,
  computeTimerText,
  getDayTimeProviderConfiguration,
  getDefaultDayTimeProviderConfiguration,
  isBrowserLocale24HoursFormat,
  secondsToMinutes,
} from './time';

describe('time helper', () => {
  describe('computeTextSeconds', () => {
    it('should return 00 when seconds is 0', () => {
      expect(computeTextSeconds(0)).toBe('00');
    });

    it('should return 01 when seconds is 1', () => {
      expect(computeTextSeconds(1)).toBe('01');
    });

    it('should return 10 when seconds is 10', () => {
      expect(computeTextSeconds(10)).toBe('10');
    });

    it('should return 59 when seconds is 59', () => {
      expect(computeTextSeconds(59)).toBe('59');
    });
  });

  describe('computeTextMinutes', () => {
    it('should return 00 when minutes is 0', () => {
      expect(computeTextSeconds(0)).toBe('00');
    });

    it('should return 01 when minutes is 1', () => {
      expect(computeTextSeconds(1)).toBe('01');
    });

    it('should return 10 when minutes is 10', () => {
      expect(computeTextSeconds(10)).toBe('10');
    });

    it('should return 59 when minutes is 59', () => {
      expect(computeTextSeconds(59)).toBe('59');
    });
  });

  describe('secondsToMinutes', () => {
    it('should return 0 minutes and 0 seconds when seconds is 0', () => {
      expect(secondsToMinutes(0)).toEqual({ minutes: 0, seconds: 0 });
    });

    it('should return 0 minutes and 59 seconds when seconds is 59', () => {
      expect(secondsToMinutes(59)).toEqual({ minutes: 0, seconds: 59 });
    });

    it('should return 2 minutes and 0 seconds when seconds is 120', () => {
      expect(secondsToMinutes(120)).toEqual({ minutes: 2, seconds: 0 });
    });
  });

  describe('computeTimerText', () => {
    it('should return 00:06 when time is 6', () => {
      expect(computeTimerText(6)).toBe('00:06');
    });

    it('should return 00:59 when time is 59', () => {
      expect(computeTimerText(59)).toBe('00:59');
    });

    it('should return 02:00 when time is 120', () => {
      expect(computeTimerText(120)).toBe('02:00');
    });
  });

  describe('isBrowserLocale24HoursFormat', () => {
    it('should return true for fr', () => {
      expect(isBrowserLocale24HoursFormat('fr')).toBe(true);
    });

    it('should return false for en-US', () => {
      expect(isBrowserLocale24HoursFormat('en-US')).toBe(false);
    });
  });

  describe('getDayTimeProviderConfiguration', () => {
    it('should return the day time provider configuration', () => {
      const date = new Date('2021-01-01T00:00:00.000Z');
      const language = 'en-US';

      const result = getDayTimeProviderConfiguration(() => date, language);
      expect(result.now()).toEqual(date);
      expect(result.locales).toEqual(language);
      expect(result.hour12).toBe(true);
    });
  });

  describe('getDefaultDayTimeProviderConfiguration', () => {
    it('should return the default day time provider', () => {
      const dateNow = new Date(Date.now());
      const language = navigator.language;
      const is24HoursFormat = isBrowserLocale24HoursFormat(language);

      const result = getDefaultDayTimeProviderConfiguration();

      expect(result.now().toLocaleTimeString()).toEqual(dateNow.toLocaleTimeString());
      expect(result.locales).toEqual(language);
      expect(result.hour12).toEqual(!is24HoursFormat);
    });
  });
});
