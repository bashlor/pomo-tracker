import { useEffect, useRef, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { ApplicationData } from '../../@types/app';
import { getDefaultApplicationData, persistentApplicationDataKey } from '../../helpers/application';
import { Card, TextInput, Text, CardBody, CardHeader } from 'grommet';

export function RunningTask({initialTaskName}:{initialTaskName:string}) {
  const [appState, setAppState] = useLocalStorage<ApplicationData>(persistentApplicationDataKey, getDefaultApplicationData());
  const [name, setName] = useState(initialTaskName || getDefaultApplicationData().currentTaskName);
  const [tasksSuggestions, setTasksSuggestions] = useState<string[]>(appState.tasks);
  const inputRef = useRef<null | HTMLInputElement>(null);

  useEffect(() => {
    if (name) {
      setTasksSuggestions(appState.tasks.filter((task) => task.toLowerCase().includes(name.toLowerCase())));
      setAppState({ ...appState, currentTaskName: name.trim() });
    }
  }, [name]);

  const handleFocus = () => {
    const input = inputRef.current;
    if (input) {
      const length = input.value.length;
      input.setSelectionRange(length, length);
    }
  };

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
          onChange={(event) => setName(event.target.value)}
          onSuggestionSelect={(target) => setName(target.suggestion)}
          onFocus={handleFocus}
          ref={inputRef}
        />
      </CardBody>
    </Card>
  );
}
