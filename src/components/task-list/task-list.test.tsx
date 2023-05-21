import { describe, expect } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import { TaskList } from './task-list';
import { render } from '../../setup/test-utils';

describe('TaskList', () => {
  it('should render the task list', () => {
    render(<TaskList taskList={[]} onChange={() => null} />);
    const taskListElement = screen.getByTestId('task-list');
    expect(taskListElement).toBeDefined();
  });

  it('should render the task list using props', () => {
    render(<TaskList taskList={['task 1', 'task 2']} onChange={() => null} />);
    const taskListElement = screen.getAllByTestId('task-list-item');

    expect(taskListElement.length).toBe(2);
    expect(taskListElement[0]).toHaveTextContent('task 1');
    expect(taskListElement[1]).toHaveTextContent('task 2');
  });

  it('should delete a task from localStorage when a task is deleted', () => {
    let tasks = ['task 1', 'task 2'];
    render(
      <TaskList
        taskList={tasks}
        onChange={(updatedTasks) => {
          tasks = updatedTasks;
        }}
      />
    );
    const taskDeleteButtons = screen.getAllByTestId('delete-task-button');
    fireEvent.click(taskDeleteButtons[0]);

    expect(tasks).toEqual(['task 2']);
  });

  it('should update the task name in localStorage when a task is updated', () => {
    let tasks = ['task 1', 'task 2'];

    render(
      <TaskList
        taskList={tasks}
        onChange={(updatedTasks) => {
          tasks = updatedTasks;
        }}
      />
    );

    const newTaskName = 'new task name';

    const taskEditButtons = screen.getAllByTestId('edit-task-button');
    fireEvent.click(taskEditButtons[0]);

    const inputElement = screen.getByTestId('edit-task-input');

    fireEvent.change(inputElement, { target: { value: newTaskName } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });

    expect(tasks).toContain(newTaskName);
  });
});
