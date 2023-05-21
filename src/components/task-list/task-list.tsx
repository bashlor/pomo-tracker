import { Box } from 'grommet';
import { nanoid } from 'nanoid';

import { useState } from 'react';
import { EditableTaskCard } from '../editable-task-card/editable-task-card';

export function TaskList({ taskList, onChange }: { taskList: string[]; onChange: (tasks: string[]) => void }) {
  const [tasks, setTasks] = useState(taskList);

  function deleteTask(taskName: string) {
    const newTaskArray = tasks.filter((task) => task !== taskName);

    setTasks(newTaskArray);
    onChange(newTaskArray);
  }

  function changeTaskName(oldTaskName: string, newTaskName: string) {
    const oldTaskNameIndex = tasks.indexOf(oldTaskName);
    if (oldTaskNameIndex !== -1) {
      const newTaskArray = [...tasks];
      newTaskArray[oldTaskNameIndex] = newTaskName;

      setTasks(newTaskArray);
      onChange(newTaskArray);
    }
  }
  return (
    <Box data-testid="task-list">
      {tasks.map((taskName) => (
        <Box key={nanoid()} data-testid="task-list-item">
          <EditableTaskCard
            deleteTask={(taskName) => deleteTask(taskName)}
            afterNameChange={(newTaskName) => changeTaskName(taskName, newTaskName)}
            name={taskName}
          />
        </Box>
      ))}
    </Box>
  );
}
