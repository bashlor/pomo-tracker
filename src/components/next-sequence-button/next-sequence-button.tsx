import { Box, Button, Text } from 'grommet';
import { LinkNext } from 'grommet-icons';
import { theme } from '../../util/theme';
import { useAtom } from 'jotai';
import { activeColorThemeAtom } from '../../store/ui';

export function NextSequenceButton({ nextTimerModeLabel, onClick }: { nextTimerModeLabel: string; onClick: () => void }) {
  const [activeThemeColor] = useAtom(activeColorThemeAtom);

  return (
    <Button
      data-testid="next-timer-mode-button"
      onClick={onClick}
      pad={{ vertical: 'medium', horizontal: 'medium' }}
      style={{
        backgroundColor: '#FFF',
        borderRadius: '4px',
        color: theme.global.colors[activeThemeColor].default,
        height: '50px',
        marginTop: '20px',
        marginBottom: '20px',
        textAlign: 'center',
        boxShadow: 'rgb(235, 235, 235) 0px 6px 0px',
      }}
    >
      <Box flex direction="row" align="center" justify="around">
        <Text>Next Sequence : {nextTimerModeLabel}</Text>
        <LinkNext color={theme.global.colors[activeThemeColor].default} />
      </Box>
    </Button>
  );
}
