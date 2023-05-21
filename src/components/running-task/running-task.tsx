import { ChangeEvent, useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { ApplicationData } from '../../@types/app';
import { getDefaultApplicationData, persistentApplicationDataKey } from '../../helpers/application';
import { Card, TextInput, Text, CardBody, CardHeader } from 'grommet';

export function RunningTask({ taskName }: { taskName?: string }) {
  const [appState, setAppState] = useLocalStorage<ApplicationData>(persistentApplicationDataKey, getDefaultApplicationData());
  const [name, setName] = useState(taskName || getDefaultApplicationData().currentTaskName);
  const [tasksSuggestions, setTasksSuggestions] = useState<string[]>(appState.tasks);
  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value.trim());
    if (event.target.value.trim().length > 0) {
      setAppState({ ...appState, currentTaskName: event.target.value.trim() });
    }
  };

  useEffect(() => {
    if (taskName) {
      setName(taskName);
      setTasksSuggestions(appState.tasks.filter((task) => task.toLowerCase().includes(taskName.toLowerCase())));
    }
  }, [taskName]);

  return (
    <Card pad="medium" background="#FFF" data-testid="running-task">
      <CardHeader margin={{ bottom: 'small' }}>
        <Text>Running Task</Text>
      </CardHeader>
      <CardBody>
        <TextInput
          suggestions={tasksSuggestions}
          data-testid="running-task-input"
          value={name}
          id="name"
          type="text"
          onChange={handleNameChange}
          onSuggestionSelect={(target) => setName(target.suggestion)}
        />
      </CardBody>
    </Card>
  );
}
