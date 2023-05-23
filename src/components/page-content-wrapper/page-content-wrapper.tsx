import { Box } from 'grommet';
import { ReactElement, ReactNode } from 'react';

export function PageContentWrapper({ children }: { children: ReactElement | ReactElement[] | string | ReactNode }) {
  return (
    <Box
      style={{
        width: 'min(95%, 540px)',
        margin: '0 auto',
      }}
      alignSelf="center"
      flex
    >
      {children}
    </Box>
  );
}
