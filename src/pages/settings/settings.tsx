import { ChangeEvent, useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Box,
  Text,
  PageContent,
  RangeInput,
  CardFooter,
  Form,
  CardHeader,
  TextInput,
  Button,
  FormField,
  Select,
  Page,
} from 'grommet';
import { SequenceInputBuilder } from '../../components/sequence-input-builder/sequence-input-builder';
import { SimpleCheckbox } from '../../components/simple-checkbox/simple-checkbox';
import { getTimerModeLabel, sequenceFromSettingsToTimerMode } from '../../helpers/pomodoro';
import { ApplicationData, TimerMode } from '../../@types/app';
import { getDefaultSettings, persistantSettingsKey } from '../../helpers/settings';
import { activeColorThemeAtom } from '../../store/ui';
import { useAtom } from 'jotai';
import { theme } from '../../util/theme';

import { useDebounce, useLocalStorage } from 'usehooks-ts';

import bellSound from '../../assets/bell.mp3';
import { Settings as SettingType } from '../../@types/settings';
import { PageContentWrapper } from '../../components/page-content-wrapper/page-content-wrapper';
import { getDefaultApplicationData, persistentApplicationDataKey } from '../../helpers/application';
import { toast } from 'react-toastify';
export function Settings() {
  const [settingsInfo, setSettingsInfo] = useLocalStorage<SettingType>(persistantSettingsKey, getDefaultSettings());
  const [, setApplicationData] = useLocalStorage<ApplicationData>(persistentApplicationDataKey, getDefaultApplicationData());

  const [activeThemeColor] = useAtom(activeColorThemeAtom);
  const [firstLoad, setFirstLoad] = useState(true);

  const [volume, setVolume] = useState(settingsInfo.soundVolume || 0);
  const debouncedVolume = useDebounce<number>(volume, 300);

  const audio = new Audio(bellSound);

  function play() {
    audio.volume = volume / 100;
    audio.play();
  }

  useEffect(() => {
    setFirstLoad(false);
  }, []);

  useEffect(() => {
    if (!firstLoad) {
      play();
    }
  }, [debouncedVolume]);

  const handleWorkDurationChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSettingsInfo({
      ...settingsInfo,
      workDuration: Number(event.target.value),
    });
  };

  const handleShortBreakDurationChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSettingsInfo({
      ...settingsInfo,
      shortBreakDuration: Number(event.target.value),
    });
  };

  const handleLongBreakDurationChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSettingsInfo({
      ...settingsInfo,
      longBreakDuration: Number(event.target.value),
    });
  };

  const handleSequenceChange = (values: string[]) => {
    const timerModeChars = values.map((timerMode) => timerMode[0]).join(' ');

    setSettingsInfo({
      ...settingsInfo,
      sequence: timerModeChars,
    });
  };

  const handleAutoStartNextSequenceChange = (newValue: boolean) => {
    setSettingsInfo({
      ...settingsInfo,
      autoStartNextSequence: newValue,
    });
  };

  const handleVolumeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSettingsInfo({
      ...settingsInfo,
      soundVolume: Number(event.target.value),
    });
    setVolume(Number(event.target.value));
  };

  const prettySequence = sequenceFromSettingsToTimerMode(settingsInfo)
    .unwrapOr([] as TimerMode[])
    .map((timerModeStringValue: TimerMode) => getTimerModeLabel(timerModeStringValue).unwrapOr('error'));

  return (
    <Page data-testid="settings-page" background={theme.global.colors[activeThemeColor].default}>
      <PageContent style={{ overflowY: 'auto', display: 'unset' }} pad="medium" width="100%" flex justify="between">
        <PageContentWrapper>
          <Card>
            <CardHeader pad="medium">
              <Text size="large">Settings</Text>
            </CardHeader>
            <CardBody pad="medium">
              <Form data-testid="timer-form">
                <Box>
                  <FormField name="work-duration" htmlFor="work-duration" label="Work Duration">
                    <Box flex direction="row" align="center" justify="between">
                      <RangeInput
                        data-testid="work-duration-input"
                        name="work-duration"
                        type="range"
                        id="work-duration"
                        onChange={handleWorkDurationChange}
                        defaultValue={settingsInfo.workDuration}
                        style={{ maxWidth: '70%' }}
                        min={1}
                        max={120}
                      />
                      <Box>
                        <TextInput
                          type="number"
                          width="60px"
                          value={settingsInfo.workDuration}
                          onChange={handleWorkDurationChange}
                          min={1}
                          max={120}
                        ></TextInput>
                      </Box>
                    </Box>
                  </FormField>

                  <FormField name="short-break-duration" htmlFor="short-break-duration" label="Short Break Duration">
                    <Box flex direction="row" align="center" justify="between">
                      <RangeInput
                        data-testid="short-break-duration-input"
                        name="short-break-duration"
                        type="range"
                        id="short-break-duration"
                        onChange={handleShortBreakDurationChange}
                        defaultValue={settingsInfo.shortBreakDuration}
                        style={{ maxWidth: '70%' }}
                        min={1}
                        max={settingsInfo.workDuration}
                      />
                      <Box>
                        <TextInput
                          type="number"
                          width="60px"
                          value={settingsInfo.shortBreakDuration}
                          onChange={handleShortBreakDurationChange}
                          min={1}
                          max={settingsInfo.workDuration}
                        ></TextInput>
                      </Box>
                    </Box>
                  </FormField>

                  <FormField name="long-break-duration" htmlFor="long-break-duration" label="Long Break Duration">
                    <Box flex direction="row" align="center" justify="between">
                      <RangeInput
                        data-testid="long-break-duration-input"
                        name="long-break-duration"
                        type="range"
                        id="long-break-duration"
                        onChange={handleLongBreakDurationChange}
                        defaultValue={settingsInfo.longBreakDuration}
                        style={{ maxWidth: '70%' }}
                        min={1}
                        max={settingsInfo.workDuration}
                      />
                      <Box>
                        <TextInput
                          type="number"
                          width="60px"
                          value={settingsInfo.longBreakDuration}
                          min={1}
                          max={settingsInfo.workDuration}
                          onChange={handleLongBreakDurationChange}
                        ></TextInput>
                      </Box>
                    </Box>
                  </FormField>
                  <SimpleCheckbox
                    initialValue={settingsInfo.autoStartNextSequence}
                    reverse={true}
                    toggle={true}
                    fill={true}
                    label="Auto Start Timers"
                    onChangeCallback={handleAutoStartNextSequenceChange}
                  />
                </Box>

                <Box margin={{ bottom: 'medium' }}>
                  <Text> Sequence</Text>
                </Box>
                <SequenceInputBuilder onSequenceChange={handleSequenceChange} initialValues={prettySequence} />
              </Form>
              <Form>
                <FormField
                  margin={{ top: 'large', bottom: 'medium' }}
                  name="sound"
                  htmlFor="sound-input"
                  label="Sound"
                  style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
                >
                  <Select width="150px" disabled={true} value={settingsInfo.soundName} options={['bell']} id="sound-input" name="sound" />
                </FormField>
                <FormField
                  name="sound-volume"
                  htmlFor="sound-volume-input"
                  label={settingsInfo.soundVolume === 0 ? 'Sound volume (muted)' : 'Sound volume'}
                >
                  <Box flex direction="row" align="center" justify="between">
                    <RangeInput
                      data-testid="sound-volume-input"
                      name="sound-volume"
                      type="range"
                      id="sound-volume-input"
                      style={{ maxWidth: '70%' }}
                      value={settingsInfo.soundVolume}
                      onChange={handleVolumeChange}
                      min={0}
                      max={100}
                    />
                    <Box>
                      <TextInput width="60px" value={settingsInfo.soundVolume} />
                    </Box>
                  </Box>
                </FormField>
              </Form>
            </CardBody>
            <CardFooter>
              <Box pad="medium" flex direction="row" justify="end" gap="10px">
                <Button
                  primary={true}
                  label="Reset Settings"
                  onClick={() => {
                    setSettingsInfo(getDefaultSettings());
                    toast.info('Settings reset', {
                      autoClose: 2000,
                      toastId: 'reset-settings-toast',
                    });
                  }}
                  data-testid="reset-button"
                />
                <Button
                  primary={true}
                  style={{
                    backgroundColor: theme.global.colors['red'].dark,
                  }}
                  label="Reset Data"
                  onClick={() => {
                    setApplicationData(getDefaultApplicationData());
                    toast.info('Data removed', {
                      autoClose: 2000,
                      toastId: 'reset-data-toast',
                    });
                  }}
                />
              </Box>
            </CardFooter>
          </Card>
        </PageContentWrapper>
      </PageContent>
    </Page>
  );
}
