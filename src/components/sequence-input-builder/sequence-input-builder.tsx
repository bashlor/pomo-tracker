import React, { useState } from 'react';
import { TimerModeTypeObject } from '../../@types/app';
import { getTimerModeLabel } from '../../helpers/pomodoro';
import { TagInput } from '../tag-input/tag-input';

const allSuggestions: TimerModeValue[] = [
  TimerModeTypeObject.enum.work,
  TimerModeTypeObject.enum.shortBreak,
  TimerModeTypeObject.enum.longBreak,
].map((mode) => getTimerModeLabel(mode).unwrapOr('error'));

const TimerModeLabel = {
  [TimerModeTypeObject.enum.work]: 'Work',
  [TimerModeTypeObject.enum.shortBreak]: 'Short Break',
  [TimerModeTypeObject.enum.longBreak]: 'Long Break',
};

type TimerModeValue = (typeof TimerModeLabel)[TimerModeKeys];
type TimerModeKeys = keyof typeof TimerModeLabel;

export function SequenceInputBuilder({
  onSequenceChange,
  initialValues,
}: {
  onSequenceChange: (sequence: TimerModeValue[]) => void;
  initialValues: TimerModeValue[];
}) {
  const [selectedTimerModes, setSelectedTimerModes] = useState<TimerModeValue[]>(initialValues);
  const [suggestions, setSuggestions] = useState<string[]>(allSuggestions);

  const onRemoveTag = (tag: TimerModeValue) => {
    const removeIndex = selectedTimerModes.indexOf(tag);
    const newTags = [...selectedTimerModes];
    if (removeIndex >= 0) {
      newTags.splice(removeIndex, 1);
    }
    setSelectedTimerModes(newTags);
    onSequenceChange(newTags);
  };

  const onAddTimerModeOnSequence = (tag: string) => {
    if (tag.trim().length === 0) return;

    const mostProbableTimerModeKey = Object.keys(TimerModeTypeObject).find((timerMode) => timerMode.includes(tag.toLowerCase()));

    if (mostProbableTimerModeKey) {
      // @ts-expect-error - typescript doesn't know that mostProbableTimerModeKey is a key of timerModes
      setSelectedTimerModes([...selectedTimerModes, timerModes[mostProbableTimerModeKey]]);
    }
  };

  const onFilterSuggestion = (value: TimerModeValue) =>
    setSuggestions(allSuggestions.filter((suggestion) => suggestion.toLowerCase().indexOf(value.toLowerCase()) >= 0));

  return (
    <TagInput
      data-testid="sequence-input-builder"
      placeholder={selectedTimerModes.length === 0 ? `Ex: Work, Short Break...` : ''}
      suggestions={suggestions}
      value={selectedTimerModes}
      onRemove={onRemoveTag}
      onAdd={onAddTimerModeOnSequence}
      onSuggestionSelected={(suggestion) => {
        setSelectedTimerModes([...selectedTimerModes, suggestion]);
        onSequenceChange([...selectedTimerModes, suggestion]);
      }}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        onFilterSuggestion(value);
        onSequenceChange(selectedTimerModes);
      }}
    />
  );
}
