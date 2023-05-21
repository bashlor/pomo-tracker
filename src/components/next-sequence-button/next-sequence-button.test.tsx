import { describe, expect, vi } from 'vitest';
import { render } from '../../setup/test-utils';
import { fireEvent, screen } from '@testing-library/react';
import { NextSequenceButton } from './next-sequence-button';

describe('Next Sequence Button', () => {
  it('should be defined', () => {
    render(<NextSequenceButton onClick={() => null} nextTimerModeLabel={'Short Break'} />);
    const nextSequenceButton = screen.getByTestId('next-timer-mode-button');
    expect(nextSequenceButton).toBeInTheDocument();
  });

  it('should accept the nextTimerModeLabel as a prop and use it', () => {
    render(<NextSequenceButton onClick={() => null} nextTimerModeLabel={'Short Break'} />);
    const nextSequenceButton = screen.getByTestId('next-timer-mode-button');
    expect(nextSequenceButton).toHaveTextContent('Short Break');
  });

  it('should accept a OnClick callback prop', () => {
    const mockOneClick = vi.fn();
    render(<NextSequenceButton nextTimerModeLabel={'Short Break'} onClick={mockOneClick} />);
    const nextSequenceButton = screen.getByTestId('next-timer-mode-button');

    fireEvent.click(nextSequenceButton);

    expect(mockOneClick).toHaveBeenCalled();
  });
});
