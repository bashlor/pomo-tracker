import React, { ChangeEvent, useEffect, useState } from 'react';
import { Box, CheckBox } from 'grommet';

export function SimpleCheckbox({
  initialValue,
  label,
  onChangeCallback,
  disabled,
  reverse = false,
  toggle = false,
  fill = false,
  center = false,
}: {
  initialValue: boolean;
  label: string;
  reverse?: boolean;
  toggle?: boolean;
  disabled?: boolean;
  fill?: boolean;
  center?: boolean;
  onChangeCallback: (checked: boolean) => void;
}) {
  const [checkedState, setCheckedState] = useState(initialValue);

  useEffect(() => {
    setCheckedState(initialValue);
  }, [initialValue]);
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCheckedState(event.target.checked);
    onChangeCallback(event.target.checked);
  };

  return (
    <Box style={{ margin: center ? '0 auto' : undefined }} pad={{ horizontal: 'none', vertical: 'medium' }}>
      <CheckBox
        fill={fill}
        reverse={reverse}
        toggle={toggle}
        disabled={disabled}
        label={label}
        checked={checkedState}
        onChange={onChange}
      />
    </Box>
  );
}
