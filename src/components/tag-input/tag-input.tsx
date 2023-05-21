// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck - issues with typescript and grommet
import { Box, Keyboard, Tag, TextInput } from 'grommet';
import React, { useRef, useState } from 'react';
import { theme } from '../../util/theme';
import { useAtom } from 'jotai';
import { activeColorThemeAtom } from '../../store/ui';

export const TagInput = ({
  value = [],
  onAdd,
  onChange,
  onRemove,
  placeholder,
  onSuggestionSelected,
  suggestions,
  ...rest
}: {
  value: string[];
  onAdd: (tag: string) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (tag: string) => void;
  placeholder: string;
  onSuggestionSelected: (tag: string) => void;
  suggestions: string[];
}) => {
  const [currentTag, setCurrentTag] = useState('');
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [activeThemeColor] = useAtom(activeColorThemeAtom);
  const updateCurrentTag = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTag(event.target.value);
    if (onChange) {
      onChange(event);
    }
  };

  const onAddTag = (tag: string) => {
    if (onAdd) {
      onAdd(tag);
    }
  };

  const onEnter = () => {
    if (currentTag.length) {
      onAddTag(currentTag);
      setCurrentTag('');
    }
  };

  const onBackspace = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (currentTag.length > 0) {
      setCurrentTag(currentTag.slice(0, -1));
      return;
    }
    if (event.key === 'Backspace' && value.length > 0) {
      onRemove(value[value.length - 1]);
    }
  };

  const renderValue = () =>
    value.map((v, index) => (
      <Tag
        style={{ backgroundColor: theme.global.colors[activeThemeColor].light, color: '#FFF', marginBottom: '5px', border: 'none' }}
        data-testid="tag-input"
        value={`${index + 1} - ${v}`}
        key={`${v}-${index}`}
        onRemove={() => onRemove(v)}
      />
    ));

  return (
    <Keyboard onEnter={onEnter}>
      <Box
        flex
        gap="small"
        justify="start"
        background={theme.global.colors.input}
        style={{ border: 'none', borderRadius: '4px' }}
        data-testid="tag-input-box"
        direction="row"
        align="center"
        pad={{ horizontal: 'xsmall', vertical: 'medium' }}
        border="all"
        ref={boxRef}
        wrap
      >
        {value.length > 0 && renderValue()}
        <Box flex style={{ minWidth: '120px' }}>
          <TextInput
            type="search"
            plain
            placeholder={placeholder}
            suggestions={suggestions}
            onChange={updateCurrentTag}
            value={currentTag}
            onSuggestionSelect={(event) => {
              onSuggestionSelected(event.suggestion);
            }}
            onKeyDown={onBackspace}
            {...rest}
          />
        </Box>
      </Box>
    </Keyboard>
  );
};
