export function computeTimerText(time: number) {
  const { minutes, seconds } = secondsToMinutes(time);
  return `${computeTextMinutes(minutes)}:${computeTextSeconds(seconds)}`;
}

export function secondsToMinutes(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = seconds % 60;

  return { minutes, seconds: secondsLeft };
}

export function computeTextMinutes(minutes: number) {
  if (minutes < 10) {
    return `0${minutes}`;
  }
  return minutes;
}

export function computeTextSeconds(seconds: number) {
  if (seconds < 10) {
    return `0${seconds}`;
  }
  return `${seconds}`;
}

export function isBrowserLocale24HoursFormat(language: string) {
  return !new Intl.DateTimeFormat(language, { hour: 'numeric' }).format(0).match(/AM/);
}

export function getDayTimeProviderConfiguration(nowFunction: () => Date, language: string) {
  return {
    now: nowFunction,
    locales: language,
    hour12: !isBrowserLocale24HoursFormat(language),
  };
}

export function getDefaultDayTimeProviderConfiguration() {
  return getDayTimeProviderConfiguration(() => new Date(Date.now()), navigator.language);
}

export function equalDate(date1: Date, date2: Date) {
  const day1 = date1.getDate();
  const month1 = date1.getMonth();
  const year1 = date1.getFullYear();

  const day2 = date2.getDate();
  const month2 = date2.getMonth();
  const year2 = date2.getFullYear();

  return day1 === day2 && month1 === month2 && year1 === year2;
}
