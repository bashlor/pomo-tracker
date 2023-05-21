import { Box, Button, Card, CardBody, Text, TextInput } from 'grommet';
import React, { useEffect, useRef, useState } from 'react';
import { Edit, Trash } from 'grommet-icons';
import { useOnClickOutside } from 'usehooks-ts';

export function EditableTaskCard({
  name,
  deleteTask,
  afterNameChange,
}: {
  name: string;
  deleteTask: (taskName: string) => void;
  afterNameChange: (newTaskName: string) => void;
}) {
  const [editMode, setEditMode] = useState(false);
  const [updatedTaskName, setUpdatedTaskName] = useState(name);

  const ref = useRef(null);

  useEffect(() => {
    if (updatedTaskName !== name) {
      afterNameChange(updatedTaskName);
    }
  }, [editMode]);

  const handleClickOutside = () => {
    if (editMode) {
      setEditMode(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setEditMode(false);
      setUpdatedTaskName(name);
      return;
    }
    if (event.key === 'Enter') {
      setEditMode(false);
    }
  };

  useOnClickOutside(ref, handleClickOutside);

  return (
    <Card data-testid="task-card" pad="medium" background="#FFF" margin={{ bottom: 'small' }}>
      <CardBody direction="row" justify="between" align="center">
        {editMode ? (
          <TextInput
            ref={ref}
            data-testid="edit-task-input"
            onChange={(e) => setUpdatedTaskName(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => setEditMode(false)}
            value={updatedTaskName}
          />
        ) : (
          <Text data-testid="task-name">{updatedTaskName}</Text>
        )}
        <Box direction="row" justify="between">
          <Button data-testid="edit-task-button" onClick={() => setEditMode(!editMode)} placeholder="Edit" icon={<Edit />} />
          <Button data-testid="delete-task-button" onClick={() => deleteTask(updatedTaskName)} placeholder="Delete" icon={<Trash />} />
        </Box>
      </CardBody>
    </Card>
  );
}
