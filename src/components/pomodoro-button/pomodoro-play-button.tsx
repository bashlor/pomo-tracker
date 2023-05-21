import { ProgressBarPlayButton } from './progress-bar-play-button';
import { useAtom } from 'jotai';
import { activeColorThemeAtom } from '../../store/ui';
import { theme } from '../../util/theme';

export function PomodoroPlayButton({ onClick, progressPercentage = 100 }: { onClick: () => void; progressPercentage: number }) {
  const [activeThemeColor] = useAtom(activeColorThemeAtom);
  return (
    <ProgressBarPlayButton
      backgroundColor={theme.global.colors[activeThemeColor].dark}
      onClick={onClick}
      progress={progressPercentage}
      trackWidth={5}
      indicatorWidth={10}
    />
  );
}
