import { computeTimerText } from '../../helpers/time';
import { useEffect, useMemo, useState } from 'react';
import {
  getActiveColorThemeBasedOnTimerMode,
  returnApplicationDataWithNextSequence,
  timerModeToDurationInSeconds,
} from '../../helpers/pomodoro';
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts';
import { Settings } from '../../@types/settings';
import { getDefaultSettings, persistantSettingsKey } from '../../helpers/settings';
import { getDefaultApplicationData, persistentApplicationDataKey } from '../../helpers/application';
import { ApplicationData } from '../../@types/app';
import { nanoid } from 'nanoid';
import { Box, Button, Text } from 'grommet';
import { PomodoroPlayButton } from '../pomodoro-button/pomodoro-play-button';
import { StopFill } from 'grommet-icons';
import { useAtom } from 'jotai';
import { isTimerRunningAtom } from '../../store/timer';
import { theme } from '../../util/theme';
import { activeColorThemeAtom } from '../../store/ui';

import bellSound from '../../assets/bell.mp3';
import { toast } from 'react-toastify';
import { ToastIds } from '../../util/toasts';

export function PomodoroTimer({ initialTime, linkSessionToTask }: { initialTime: number; linkSessionToTask: boolean }) {
  const [startedDate, setStartedDate] = useState<Date | null>(null);
  const [remainingTime, setRemainingTime] = useState(initialTime);

  const [isRunning, setIsRunning] = useAtom(isTimerRunningAtom);
  const [timerId, setTimerId] = useState<NodeJS.Timer | null>(null);
  const settingsInfo = useReadLocalStorage<Settings>(persistantSettingsKey);
  const [appData, setAppData] = useLocalStorage<ApplicationData>(persistentApplicationDataKey, getDefaultApplicationData());
  const [activeThemeColor, setActiveThemeColor] = useAtom(activeColorThemeAtom);

  const audio = new Audio(bellSound);
  const volume = settingsInfo?.soundVolume ? Number(settingsInfo.soundVolume / 100) : 0;
  function play() {
    audio.volume = volume;
    audio.play();
  }

  const timerText = useMemo(() => computeTimerText(remainingTime), [remainingTime]);

  const startHandler = () => {
    toast.info('Timer started', {
      toastId: ToastIds.TimerStatus,
      position: 'bottom-right',
      autoClose: 1000
    });
    setIsRunning(true);
    setStartedDate(new Date());
  };

  const stopHandler = () => {
    toast.info('Timer stopped', {
      toastId: ToastIds.TimerStatus,
      position: 'bottom-right',
      autoClose: 1000
    });
    setIsRunning(false);
    setRemainingTime(initialTime);
    setAppData((appData) => ({ ...appData, currentSequenceId: nanoid() }));
    if (timerId) clearInterval(timerId);
  };

  const resumeHandler = () => {
    setIsRunning(!isRunning);
  };

  const nextStepInSequence = () => {
    const settings = settingsInfo || getDefaultSettings();

    if (startedDate) {
      const newApplicationDataResult = returnApplicationDataWithNextSequence(settings, appData, startedDate, new Date(), linkSessionToTask);
      if (newApplicationDataResult.isErr()) {
        console.error('unable to initialize next timer sequence');
        return;
      }

      const newRemainingTimer = timerModeToDurationInSeconds(settings, newApplicationDataResult.value.timerMode);

      setRemainingTime(newRemainingTimer);
      setAppData(newApplicationDataResult.value);
      setStartedDate(null);
    }
  };

  useEffect(() => {
    const newRemainingTimer = settingsInfo ? timerModeToDurationInSeconds(settingsInfo, appData.timerMode) : initialTime;
    setRemainingTime(newRemainingTimer);
    setActiveThemeColor(getActiveColorThemeBasedOnTimerMode(appData.timerMode));
  }, [appData.timerMode]);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setRemainingTime((remainingTime) => (remainingTime > 0 ? remainingTime - 1 : 0));
      }, 1000);
      setTimerId(interval);
      return () => {
        clearInterval(interval);
        toast.info('Timer stopped', {
          toastId: ToastIds.TimerStatus,
          position: 'bottom-right',
          autoClose: 1000
        });
        setIsRunning(false);
      };
    }
  }, [isRunning]);

  useEffect(() => {
    if (remainingTime === 0 && settingsInfo?.autoStartNextSequence) {
      play();
      nextStepInSequence();
      startHandler();
      return;
    }

    if (remainingTime === 0) {
      play();
      stopHandler();
      nextStepInSequence();
    }
  }, [remainingTime]);

  const handleClickOnPomodoroPlayButton = () => {
    if (initialTime === remainingTime && !isRunning) {
      startHandler();
      return;
    }
    resumeHandler();
  };

  const computePercentage = () => {
    if (initialTime === remainingTime && !isRunning) {
      return 100;
    }
    return (remainingTime / initialTime) * 100;
  };

  return (
    <>
      <Text size="100px" textAlign="center" data-testid="pomodoro-timer">
        {timerText}
      </Text>
      <Box data-testid="pomodoro-controls" flex direction="row" justify="center" align="center">
        <PomodoroPlayButton onClick={handleClickOnPomodoroPlayButton} progressPercentage={computePercentage()} />
        <Button
          style={{
            backgroundColor: theme.global.colors[activeThemeColor].dark,
            width: '75px',
            height: '75px',
            borderRadius: '50%',
            textAlign: 'center',
          }}
          icon={<StopFill />}
          onClick={stopHandler}
          data-testid="pomodoro-stop-button"
        />
      </Box>
    </>
  );
}
