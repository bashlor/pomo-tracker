import './progress-bar.css';
import { PauseFill, PlayFill } from 'grommet-icons';
import { useEffect, useState } from 'react';

export const ProgressBarPlayButton = ({
  backgroundColor,
  progress = 0,
  trackWidth = 10,
  indicatorWidth = 10,
  onClick,
}: {
  backgroundColor: string;

  progress: number;
  trackWidth: number;
  indicatorWidth: number;
  onClick: () => void;
}) => {
  const [mode, setMode] = useState<'Play' | 'Pause'>('Play');

  const size = 100;

  const toggleMode = () => {
    const newMode = mode === 'Play' ? 'Pause' : 'Play';
    setMode(newMode);
  };

  const handleClick = () => {
    onClick();
    toggleMode();
  };

  useEffect(() => {
    if (progress === 100 && mode === 'Pause') {
      setMode('Play');
      return;
    }
  }, [progress]);

  const center = size / 2,
    radius = center - (trackWidth > indicatorWidth ? trackWidth : indicatorWidth),
    dashArray = 2 * Math.PI * radius,
    dashOffset = dashArray * ((100 - progress) / 100);

  return (
    <>
      <div className="svg-pi-wrapper" style={{ width: size, height: size }}>
        <svg className="svg-pi" style={{ width: size, height: size }}>
          <circle
            className="svg-pi-track"
            cx={center}
            cy={center}
            fill="transparent"
            r={radius}
            stroke="transparent"
            strokeWidth={trackWidth}
          />
          <circle
            className={`svg-pi-indicator`}
            cx={center}
            cy={center}
            fill="transparent"
            r={radius}
            stroke="#FFF"
            strokeWidth={4}
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
          />
        </svg>
        <div data-testid="pomodoro-start-button" className="svg-pi-label" onClick={handleClick}>
          <div className="icon-container" style={{ backgroundColor: backgroundColor }}>
            {mode === 'Play' ? <PlayFill /> : <PauseFill />}
          </div>
        </div>
      </div>
    </>
  );
};
