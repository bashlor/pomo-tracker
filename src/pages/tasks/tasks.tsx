import { Card, CardBody, Page, PageContent, PageHeader } from 'grommet';
import { useEffect } from 'react';
import { PageContentWrapper } from '../../components/page-content-wrapper/page-content-wrapper';
import { theme } from '../../util/theme';
import { useAtom } from 'jotai';
import { activeColorThemeAtom } from '../../store/ui';
import { useLocalStorage } from 'usehooks-ts';
import { ApplicationData } from '../../@types/app';
import { getDefaultApplicationData, persistentApplicationDataKey } from '../../helpers/application';
import { TaskList } from '../../components/task-list/task-list';

export function Tasks() {
  const [userData, setUserData] = useLocalStorage<ApplicationData>(persistentApplicationDataKey, getDefaultApplicationData());
  const [activeThemeColor] = useAtom(activeColorThemeAtom);

  useEffect(() => {
    setUserData({ ...userData, tasks: userData.tasks });
  }, []);

  function updateTasks(tasks: string[]) {
    setUserData({ ...userData, tasks: tasks });
  }

  return (
    <Page data-testid="tasks-page" background={theme.global.colors[activeThemeColor].default} height="100vh">
      <PageContent style={{ overflowY: 'scroll', display: 'unset' }} pad="medium" width="100%" flex justify="between">
        <PageContentWrapper>
          <PageHeader title="Tasks" />
          {userData.tasks.length > 0 && <TaskList taskList={userData.tasks} onChange={(tasks) => updateTasks(tasks)} />}
          {userData.tasks.length === 0 && (
            <Card pad="medium" background="#FFF">
              <CardBody>
                <p>There are no created tasks yet.</p>
              </CardBody>
            </Card>
          )}
        </PageContentWrapper>
      </PageContent>
    </Page>
  );
}
