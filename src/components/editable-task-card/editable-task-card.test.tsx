import { describe, expect, vi } from 'vitest';
import { render } from '../../setup/test-utils';
import { act, fireEvent, screen } from '@testing-library/react';
import { EditableTaskCard } from './editable-task-card';

describe('Editable Task Card', () => {
  it('should render the component', () => {
    const afterNameChangeCallback = () => null;
    render(<EditableTaskCard afterNameChange={afterNameChangeCallback} deleteTask={() => null} name="task name" />);

    const taskCardElement = screen.getByTestId('task-card');
    expect(taskCardElement).toBeDefined();
  });

  it('should render the task name, using the prop name', () => {
    const afterNameChangeCallback = () => null;
    render(<EditableTaskCard afterNameChange={afterNameChangeCallback} deleteTask={() => null} name="task name" />);
    const taskNameElement = screen.getByTestId('task-name');
    expect(taskNameElement).toHaveTextContent('task name');
  });

  it('should execute the delete callback when the delete button is clicked', () => {
    const deleteTask = vi.fn();
    const afterNameChangeCallback = () => null;
    render(<EditableTaskCard name="task name" afterNameChange={afterNameChangeCallback} deleteTask={deleteTask} />);
    const deleteButton = screen.getByTestId('delete-task-button');
    deleteButton.click();
    expect(deleteTask).toHaveBeenCalledTimes(1);
  });

  it('should swap to the input when I click on the edit button', () => {
    const afterNameChangeCallback = () => null;
    render(<EditableTaskCard name="task name" deleteTask={() => null} afterNameChange={afterNameChangeCallback} />);
    const editButton = screen.getByTestId('edit-task-button');
    act(() => {
      editButton.click();
    });

    const inputElement = screen.getByTestId('edit-task-input');
    expect(inputElement).toBeInTheDocument();
  });

  it('should leave edit mode when Text input is focused out', () => {
    const afterNameChangeCallback = () => null;
    render(<EditableTaskCard name="task name" deleteTask={() => null} afterNameChange={afterNameChangeCallback} />);
    const editButton = screen.getByTestId('edit-task-button');
    act(() => {
      editButton.click();
    });

    const inputElement = screen.getByTestId('edit-task-input');
    act(() => {
      editButton.click();
    });

    expect(inputElement).not.toBeInTheDocument();
  });

  it('should call the afterNameChange callback when once the name has been changed and the exit mode left', () => {
    const afterNameChangeCallback = vi.fn();
    render(<EditableTaskCard name="task name" deleteTask={() => null} afterNameChange={afterNameChangeCallback} />);
    const editButton = screen.getByTestId('edit-task-button');
    act(() => {
      editButton.click();
    });

    const inputElement = screen.getByTestId('edit-task-input');

    fireEvent.change(inputElement, { target: { value: 'new task name' } });

    act(() => {
      editButton.click();
    });

    expect(afterNameChangeCallback).toHaveBeenCalledTimes(1);
  });

  it('should switch to edit mode "off" when the escape key is pressed, and revert changes', () => {
    const afterNameChangeCallback = () => null;
    render(<EditableTaskCard name="task name" deleteTask={() => null} afterNameChange={afterNameChangeCallback} />);
    const editButton = screen.getByTestId('edit-task-button');
    act(() => {
      editButton.click();
    });

    const inputElement = screen.getByTestId('edit-task-input');

    fireEvent.change(inputElement, { target: { value: 'new task name' } });

    fireEvent.keyDown(inputElement, { key: 'Escape' });

    expect(inputElement).not.toBeInTheDocument();
    expect(screen.getByTestId('task-name')).toHaveTextContent('task name');
  });

  it('should switch to edit mode "off" when the enter key is pressed', () => {
    const afterNameChangeCallback = () => null;
    render(<EditableTaskCard name="task name" deleteTask={() => null} afterNameChange={afterNameChangeCallback} />);
    const editButton = screen.getByTestId('edit-task-button');
    act(() => {
      editButton.click();
    });

    const inputElement = screen.getByTestId('edit-task-input');

    fireEvent.keyDown(inputElement, { key: 'Enter' });

    expect(inputElement).not.toBeInTheDocument();
  });

  it('should switch to edit mode "off" when a click outside is detected', () => {
    const afterNameChangeCallback = () => null;

    render(<EditableTaskCard name="task name" deleteTask={() => null} afterNameChange={afterNameChangeCallback} />);
    const editButton = screen.getByTestId('edit-task-button');
    act(() => {
      editButton.click();
    });

    const inputElement = screen.getByTestId('edit-task-input');

    act(() => {
      editButton.click();
    });
    expect(inputElement).not.toBeInTheDocument();
  });
});
