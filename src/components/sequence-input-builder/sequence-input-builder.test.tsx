import { render, screen } from '@testing-library/react';
import { SequenceInputBuilder } from './sequence-input-builder';

describe('SequenceInputBuilder', () => {
  it('should render the SequenceInputBuilder', () => {
    render(<SequenceInputBuilder onSequenceChange={() => null} initialValues={[]} />);
    const sequenceInputBuilder = screen.getByTestId('sequence-input-builder');
    expect(sequenceInputBuilder).toBeInTheDocument();
  });
});
