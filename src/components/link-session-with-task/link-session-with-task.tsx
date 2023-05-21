import { SimpleCheckbox } from '../simple-checkbox/simple-checkbox';
import { Box } from 'grommet';

export function LinkSessionWithTask({
  checkedProp,
  onChangeCallback,
}: {
  checkedProp: boolean;
  onChangeCallback: (checked: boolean) => void;
}) {
  return (
    <Box data-testid="link-session-to-task-container">
      <SimpleCheckbox center={true} initialValue={checkedProp} label={'Link this session to a task'} onChangeCallback={onChangeCallback} />
    </Box>
  );
}
