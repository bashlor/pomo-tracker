import { describe, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../setup/test-utils';
import { PomodoroStatsInfo } from './pomodoro-stats-info';

describe('Pomodoro Stats Info', () => {
  it('should be defined', () => {
    render(<PomodoroStatsInfo sequenceLength={4} sequenceIndex={1} workedSequences={0} />);
    const pomodoroStatsInfo = screen.getByTestId('pomodoro-stats-info');
    expect(pomodoroStatsInfo).toBeDefined();
  });

  it('should accept the sequenceIndex and sequenceLength as a prop and use it', () => {
    render(<PomodoroStatsInfo sequenceIndex={1} sequenceLength={4} workedSequences={0} />);

    const sequenceIndex = screen.getByTestId('sequence-index');
    expect(sequenceIndex).toHaveTextContent('1/4');
  });

  it('should accept the worked sequences as a prop and use it', () => {
    render(<PomodoroStatsInfo sequenceLength={4} workedSequences={4} sequenceIndex={0} />);
    const workedSequences = screen.getByTestId('worked-sequences');
    expect(workedSequences).toHaveTextContent('4');
  });
});
