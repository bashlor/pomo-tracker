import { Button } from 'grommet';
import { Menu as GrommetMenuIcon } from 'grommet-icons';
import { useAtom } from 'jotai';
import { isMobileMenuOpenAtom } from '../../store/ui';

export function MenuIcon() {
  const [isMobileMenuOpen, setIsMobileMenOpen] = useAtom(isMobileMenuOpenAtom);

  const toggleSidebar = () => {
    setIsMobileMenOpen(!isMobileMenuOpen);
  };

  return (
    <div data-testid="ui-menu-button" onClick={toggleSidebar}>
      <Button icon={<GrommetMenuIcon />} />
    </div>
  );
}
