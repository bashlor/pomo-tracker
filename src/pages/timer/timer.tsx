import { PomodoroTimer } from '../../components/pomodoro/pomodoro-timer';
import { RunningTask } from '../../components/running-task/running-task';
import { useLocalStorage } from 'usehooks-ts';
import { Settings } from '../../@types/settings';
import { getDefaultSettings, persistantSettingsKey } from '../../helpers/settings';
import {
  getTimerModeLabel,
  timerModeToDurationInSeconds,
  nextTimerMode,
  getActiveColorThemeBasedOnTimerMode,
} from '../../helpers/pomodoro';
import { DayTimeProvider, TimerModeType, TimerModeTypeObject } from '../../@types/app';
import { getDefaultApplicationData, persistentApplicationDataKey } from '../../helpers/application';
import { DateComponent } from '../../components/date-component/date-component';
import { useContext, useEffect, useState } from 'react';
import { DayTimeContext } from '../../context/daytime-provider-context';
import { Page, PageContent, Text } from 'grommet';

import { NextSequenceButton } from '../../components/next-sequence-button/next-sequence-button';
import { PomodoroStatsInfo } from '../../components/pomodoro-stats-info/pomodoro-stats-info';
import { equalDate } from '../../helpers/time';
import { isTimerRunningAtom } from '../../store/timer';
import { useAtom } from 'jotai';

import { LinkSessionWithTask } from '../../components/link-session-with-task/link-session-with-task';
import { TaskCard } from '../../components/task-card/task-card';
import { activeColorThemeAtom } from '../../store/ui';
import { theme } from '../../util/theme';
import { PageContentWrapper } from '../../components/page-content-wrapper/page-content-wrapper';

export function Timer() {
  const [settingsInfo] = useLocalStorage<Settings>(persistantSettingsKey, getDefaultSettings());
  const [appData, setAppData] = useLocalStorage(persistentApplicationDataKey, getDefaultApplicationData());
  const [isTimerRunning, setIsTimerRunning] = useAtom(isTimerRunningAtom);
  const [linkSessionToTask, setLinkSessionToTask] = useState(false);
  const [activeThemeColor, setActiveThemeColor] = useAtom(activeColorThemeAtom);

  const computedNextTimerMode = nextTimerMode(settingsInfo, appData).unwrapOr(appData.timerMode);

  const dayTimeProvider: DayTimeProvider = useContext(DayTimeContext);

  const appDataSequenceIndex = appData.sequenceIndex + 1 || 0;
  const sequenceLength = settingsInfo.sequence.split(' ').length || 0;

  const workedSequences =
    appData.pomodoroSequences
      .filter((pomodoroSequence) =>
        pomodoroSequence.sessions.find((session) => equalDate(new Date(session.startDate), dayTimeProvider.now()))
      )
      .reduce((acc, pomodoroSequence) => {
        const workedSessions = pomodoroSequence.sessions.filter((session) => session.timerMode === TimerModeTypeObject.enum.work);

        return acc + workedSessions.length;
      }, 0) || 0;

  useEffect(() => {
    setActiveThemeColor(getActiveColorThemeBasedOnTimerMode(appData.timerMode));
  }, []);

  const skipToNextSequence = () => {
    setIsTimerRunning(false);

    const sequenceIndex = (appData.sequenceIndex + 1) % sequenceLength;

    const newApplicationData = { ...appData, timerMode: computedNextTimerMode, sequenceIndex };

    setAppData(newApplicationData);
    const newColorTheme = getActiveColorThemeBasedOnTimerMode(newApplicationData.timerMode);
    setActiveThemeColor(newColorTheme);
  };

  return (
    <Page data-testid="timer-page" height="100vh">
      <PageContent flex background={theme.global.colors[activeThemeColor].default} pad="medium">
        <PageContentWrapper>
          <DateComponent dayTimeProvider={dayTimeProvider} />
          <Text textAlign="center" size="50px" data-testid="timer-mode">
            {getTimerModeLabel(appData.timerMode).unwrapOr('error')}
          </Text>
          <PomodoroTimer
            initialTime={timerModeToDurationInSeconds(settingsInfo, appData.timerMode as TimerModeType)}
            linkSessionToTask={linkSessionToTask}
          />
          <PomodoroStatsInfo workedSequences={workedSequences} sequenceLength={sequenceLength} sequenceIndex={appDataSequenceIndex} />
          <LinkSessionWithTask
            checkedProp={linkSessionToTask}
            onChangeCallback={(newLinkSessionValue) => setLinkSessionToTask(newLinkSessionValue)}
          />
          <NextSequenceButton
            onClick={skipToNextSequence}
            nextTimerModeLabel={getTimerModeLabel(computedNextTimerMode).unwrapOr('error')}
          />
          {linkSessionToTask && !isTimerRunning ? <RunningTask taskName={appData.currentTaskName} /> : undefined}
          {linkSessionToTask && isTimerRunning ? <TaskCard taskName={appData.currentTaskName} /> : undefined}
        </PageContentWrapper>
      </PageContent>
    </Page>
  );
}
