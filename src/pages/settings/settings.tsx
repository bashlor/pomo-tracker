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
import {
  getTimerModeLabel,
  labelToSingleCharMode,
  sequenceFromSettingsToTimerMode,
  singleCharModeToTimerMode,
} from '../../helpers/pomodoro';
import { ApplicationData, TimerMode, TimerModeCharType, TimerModeType } from '../../@types/app';
import { getDefaultSettings, persistantSettingsKey } from '../../helpers/settings';
import { activeColorThemeAtom } from '../../store/ui';
import { useAtom } from 'jotai';
import { theme } from '../../util/theme';

import { useDebounce, useLocalStorage } from 'usehooks-ts';

import bellSound from '../../assets/bell.mp3';
import { Settings as SettingType, SettingsTypeObject } from '../../@types/settings';
import { PageContentWrapper } from '../../components/page-content-wrapper/page-content-wrapper';
import { getDefaultApplicationData, persistentApplicationDataKey } from '../../helpers/application';
import { toast } from 'react-toastify';
import { ToastIds } from '../../util/toasts';

const DEFAULT_MIN_SEQUENCE_DURATION_MINUTES = 1;
const DEFAULT_MAX_SEQUENCE_DURATION_MINUTES = 120;
export function Settings() {
  const [firstLoad, setFirstLoad] = useState(true);
  const [settingsInfoFromStorage, setSettingsInfoInStorage] = useLocalStorage<SettingType>(persistantSettingsKey, getDefaultSettings());
  const [editedSettings, setEditedSettings] = useState<SettingType>(settingsInfoFromStorage);
  const [applicationData, setApplicationData] = useLocalStorage<ApplicationData>(persistentApplicationDataKey, getDefaultApplicationData());
  const [activeThemeColor] = useAtom(activeColorThemeAtom);

  const [volume, setVolume] = useState(settingsInfoFromStorage.soundVolume || 0);

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
    setEditedSettings({
      ...editedSettings,
      workDuration: Number(event.target.value),
    });
  };

  const handleShortBreakDurationChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditedSettings({
      ...editedSettings,
      shortBreakDuration: Number(event.target.value),
    });
  };

  const handleLongBreakDurationChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditedSettings({
      ...editedSettings,
      longBreakDuration: Number(event.target.value),
    });
  };

  const handleSequenceChange = (values: string[]) => {
    const timerModeCharsResult = values.map((timerMode) => labelToSingleCharMode(timerMode));

    const errorFound = timerModeCharsResult.find((timerModeChar) => timerModeChar.isErr());

    if (errorFound?.isErr()) {
      console.error(errorFound.error);
      toast.error('Unexpected error', {
        toastId: ToastIds.UserSettings,
      });
    }

    //At this point we know that all the values are valid
    const timerModeChars = timerModeCharsResult.map((timerModeChar) => timerModeChar.unwrapOr('B')).join(' ');

    setEditedSettings({
      ...editedSettings,
      sequence: timerModeChars,
    });

    return;
  };

  const handleAutoStartNextSequenceChange = (newValue: boolean) => {
    setEditedSettings({
      ...editedSettings,
      autoStartNextSequence: newValue,
    });
  };

  const handleVolumeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditedSettings({
      ...editedSettings,
      soundVolume: Number(event.target.value),
    });
    setVolume(Number(event.target.value));
  };

  const handleSettingsReset = () => {
    setSettingsInfoInStorage(getDefaultSettings());
    setEditedSettings(getDefaultSettings());
    toast.info('Settings reset', {
      toastId: ToastIds.UserSettings,
    });
  };

  const handleUserDataDeletion = () => {
    setApplicationData(getDefaultApplicationData());
    toast.info('Data removed', {
      toastId: ToastIds.UserApplicationData,
    });
  };

  const handleSaveSettings = () => {
    try {
      SettingsTypeObject.parse(editedSettings);

      const timerModeChars = editedSettings.sequence;

      //Update the sequence index if the new sequence is shorter than the current one, so that the sequence index is not out of bounds
      const sequenceLength = timerModeChars.split(' ').length;
      if (applicationData.sequenceIndex >= sequenceLength) {
        const newTimerModeChar = timerModeChars.split(' ')[applicationData.sequenceIndex % sequenceLength] as TimerModeCharType;

        //At this point we know that the new sequence is not empty, so we can safely unwrap the result
        const newTimerMode = singleCharModeToTimerMode(newTimerModeChar).unwrapOr(null);

        if (!newTimerMode) {
          console.error('Failed to save sequence, unexpected error');
          toast.error('Failed to save sequence', {
            toastId: ToastIds.UserSettings,
          });
        }

        setApplicationData({
          ...applicationData,
          sequenceIndex: applicationData.sequenceIndex % sequenceLength,
          timerMode: newTimerMode as TimerModeType,
        });
      }

      setSettingsInfoInStorage(editedSettings);

      toast.success('Settings saved', {
        toastId: ToastIds.UserSettings,
      });
    } catch (error) {
      // We only want retrieves errors with custom messages
      const errors = error.errors.filter((error: any) => error.code === 'custom');
      const firstErrorMessage = errors[0].message ?? 'Failed to save settings';
      toast.error(firstErrorMessage, {
        toastId: ToastIds.UserSettings,
      });
    }
  };

  const prettySequence = sequenceFromSettingsToTimerMode(editedSettings)
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
                        value={editedSettings.workDuration}
                        style={{ maxWidth: '70%' }}
                        min={DEFAULT_MIN_SEQUENCE_DURATION_MINUTES}
                        max={DEFAULT_MAX_SEQUENCE_DURATION_MINUTES}
                      />
                      <Box>
                        <TextInput
                          type="number"
                          width="60px"
                          value={editedSettings.workDuration}
                          onChange={handleWorkDurationChange}
                          min={DEFAULT_MIN_SEQUENCE_DURATION_MINUTES}
                          max={DEFAULT_MAX_SEQUENCE_DURATION_MINUTES}
                        ></TextInput>
                      </Box>
                    </Box>
                  </FormField>

                  <FormField name="short-break-duration" htmlFor="short-break-duration" label="Short Break Duration">
                    <Box flex direction="row" align="center" justify="between">
                      <RangeInput
                        data-testid="short-break-duration-input"
                        name="short-break"
                        type="range"
                        id="short-break"
                        onChange={handleShortBreakDurationChange}
                        value={editedSettings.shortBreakDuration}
                        style={{ maxWidth: '70%' }}
                        min={DEFAULT_MIN_SEQUENCE_DURATION_MINUTES}
                        max={DEFAULT_MAX_SEQUENCE_DURATION_MINUTES}
                      />
                      <Box>
                        <TextInput
                          type="number"
                          width="60px"
                          value={editedSettings.shortBreakDuration}
                          onChange={handleShortBreakDurationChange}
                          min={DEFAULT_MIN_SEQUENCE_DURATION_MINUTES}
                          max={DEFAULT_MAX_SEQUENCE_DURATION_MINUTES}
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
                        value={editedSettings.longBreakDuration}
                        style={{ maxWidth: '70%' }}
                        min={DEFAULT_MIN_SEQUENCE_DURATION_MINUTES}
                        max={DEFAULT_MAX_SEQUENCE_DURATION_MINUTES}
                      />
                      <Box>
                        <TextInput
                          type="number"
                          width="60px"
                          value={editedSettings.longBreakDuration}
                          min={DEFAULT_MIN_SEQUENCE_DURATION_MINUTES}
                          max={DEFAULT_MAX_SEQUENCE_DURATION_MINUTES}
                          onChange={handleLongBreakDurationChange}
                        ></TextInput>
                      </Box>
                    </Box>
                  </FormField>
                  <SimpleCheckbox
                    initialValue={editedSettings.autoStartNextSequence}
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
                  <Select width="150px" disabled={true} value={editedSettings.soundName} options={['bell']} id="sound-input" name="sound" />
                </FormField>
                <FormField
                  name="sound-volume"
                  htmlFor="sound-volume-input"
                  label={editedSettings.soundVolume === 0 ? 'Sound volume (muted)' : 'Sound volume'}
                >
                  <Box flex direction="row" align="center" justify="between">
                    <RangeInput
                      data-testid="sound-volume-input"
                      name="sound-volume"
                      type="range"
                      id="sound-volume-input"
                      style={{ maxWidth: '70%' }}
                      value={editedSettings.soundVolume}
                      onChange={handleVolumeChange}
                      min={0}
                      max={100}
                    />
                    <Box>
                      <TextInput width="60px" type="number" onChange={handleVolumeChange} value={editedSettings.soundVolume} />
                    </Box>
                  </Box>
                </FormField>
              </Form>
            </CardBody>
            <CardFooter>
              <Box pad="medium" flex direction="row" justify="between" gap="10px">
                <Box flex direction="row" justify="start" gap="10px">
                  <Button primary={true} label="Reset Settings" onClick={() => handleSettingsReset()} />
                  <Button
                    primary={true}
                    style={{
                      backgroundColor: theme.global.colors['red'].dark,
                    }}
                    label="Delete Data"
                    onClick={() => handleUserDataDeletion()}
                  />
                </Box>
                <Button primary={true} label="Save" onClick={handleSaveSettings} data-testid="reset-button" />
              </Box>
            </CardFooter>
          </Card>
        </PageContentWrapper>
      </PageContent>
    </Page>
  );
}
