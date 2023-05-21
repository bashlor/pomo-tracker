import { Box, Nav, Text } from 'grommet';

import { Link } from 'react-router-dom';
import { useAtom } from 'jotai';

import { useRef } from 'react';
import { isMobileMenuOpenAtom } from '../../../store/ui';
import { routes } from '../../../router';
import { theme } from '../../../util/theme';

export function MobileMenu() {
  const ref = useRef(null);
  const [, setIsSidebarOpen] = useAtom(isMobileMenuOpenAtom);

  return (
    <Box ref={ref} data-testid="ui-menu">
      <Nav
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          marginLeft: 'auto',
          marginRight: 'auto',
          backgroundColor: '#FFF',
          width: '99%',
          zIndex: 1,
          borderRadius: '4px',
        }}
        gap="small"
        pad={{ horizontal: 'medium' }}
        margin={{ bottom: 'medium' }}
        data-testid="ui-nav-menu"
      >
        {routes
          .filter((route) => route.path !== '/timer')
          .map((route, index) => (
            <Link key={route.name} to={route.path} onClick={() => setIsSidebarOpen(false)}>
              <Box
                flex
                direction="row"
                gap="small"
                pad={{ vertical: 'medium' }}
                data-testid="ui-nav-menu-item"
                style={
                  index < routes.length - 1
                    ? {
                        borderBottom: `1px solid #f0f0f0`,
                      }
                    : undefined
                }
              >
                {route.icon}
                <Text
                  style={{
                    textDecoration: 'none',
                    color: `${theme.global.text.dark}`,
                  }}
                >
                  {route.name[0].toUpperCase() + route.name.slice(1)}
                </Text>
              </Box>
            </Link>
          ))}
      </Nav>
    </Box>
  );
}
