import { Box, Text } from 'grommet';

export function PomodoroStatsInfo({
  sequenceIndex,
  sequenceLength,
  workedSequences,
}: {
  sequenceIndex: number;
  sequenceLength: number;
  workedSequences: number;
}) {
  return (
    <Box data-testid="pomodoro-stats-info" flex direction="row" justify="around" margin={{ top: 'medium' }}>
      <Box flex direction="column" align="center"         style={{
        height: '80px'
      }}>
        <Text>Sequence</Text>
        <Text
          data-testid="sequence-index"
          style={{
            fontWeight: 'bold',
            fontSize: '25px',
          }}
        >
          {sequenceIndex}/{sequenceLength}
        </Text>
      </Box>
      <Box flex direction="column" align="center">
        <Text
          style={{
            fontSize: '20px',
          }}
        >
          Done Today
        </Text>
        <Text
          data-testid="worked-sequences"
          style={{
            fontWeight: 'bold',
            fontSize: '25px',
          }}
        >
          {workedSequences}
        </Text>
      </Box>
    </Box>
  );
}
