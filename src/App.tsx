import { Outlet } from 'react-router-dom';
import { Box, ResponsiveContext } from 'grommet';
import { Topbar } from './components/topbar/topbar';
import { useAtom } from 'jotai';
import { activeColorThemeAtom, isMobileMenuOpenAtom } from './store/ui';

import { theme } from './util/theme';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';
import { MobileMenu } from './components/topbar/mobile-menu/mobile-menu';
import { useContext, useEffect } from 'react';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useAtom(isMobileMenuOpenAtom);
  const deviceDisplaySize = useContext(ResponsiveContext);
  const isSmallScreen = deviceDisplaySize === 'small' || deviceDisplaySize === 'xsmall';

  const [activeThemeColor] = useAtom(activeColorThemeAtom);

  const closeMenuOnClick = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    if (!isSmallScreen) {
      setIsMobileMenuOpen(false);
    }
  }, [deviceDisplaySize]);

  return (
    <Box background={theme.global.colors[activeThemeColor].default} onClick={closeMenuOnClick} height="100vh">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={1}
      />
      <Topbar />
      {isMobileMenuOpen && isSmallScreen ? <MobileMenu /> : undefined}
      <Outlet />
    </Box>
  );
}

export default App;
