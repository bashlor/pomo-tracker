import { Box, Header, Nav, ResponsiveContext, Text } from 'grommet';
import { MenuIcon } from './menu-icon';
import { Link } from 'react-router-dom';
import { useAtom } from 'jotai';
import { activeColorThemeAtom } from '../../store/ui';
import { theme } from '../../util/theme';
import { routes } from '../../router';

export function Topbar() {
  const [activeThemeColor] = useAtom(activeColorThemeAtom);

  return (
    <Header
      data-testid="ui-topbar"
      background={{
        color: theme.global.colors[activeThemeColor].default,
      }}
      style={{ position: 'sticky' }}
      pad={{ horizontal: 'medium', vertical: 'small' }}
      justify="center"
    >
      <Box
        width="min(100%,600px)"
        flex
        direction="row"
        justify="between"
        align="center"
        style={{
          maxWidth: 'unset',
          flex: 'unset',
        }}
      >
        <Link to={'/'} style={{ textDecoration: 'none', color: theme.global.text.light }}>
          <Text style={{ fontWeight: 'bold' }} data-testid="ui-brand">
            PomoTracker
          </Text>
        </Link>
        <Box justify="end">
          <ResponsiveContext.Consumer>
            {(size) =>
              size === 'xsmall' || size === 'small' ? (
                <MenuIcon />
              ) : (
                <Nav direction="row">
                  {routes
                    .filter((route) => route.path !== '/timer')
                    .map((route) => (
                      <Link key={route.name} to={route.path}>
                        <Box flex direction="row" align="center" gap="small">
                          {route.icon}
                          <Text>{route.name[0].toUpperCase() + route.name.slice(1)}</Text>
                        </Box>
                      </Link>
                    ))}
                </Nav>
              )
            }
          </ResponsiveContext.Consumer>
        </Box>
      </Box>
    </Header>
  );
}
