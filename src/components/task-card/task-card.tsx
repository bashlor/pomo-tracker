import { Card, CardBody, CardHeader, Text } from 'grommet';

export function TaskCard({ taskName }: { taskName: string }) {
  return (
    <Card background="#FFF" pad="medium">
      <CardHeader margin={{ bottom: 'small' }}>
        <Text margin="auto">Active Task</Text>
      </CardHeader>
      <CardBody>
        <Card pad="small">
          <Text margin="auto">{taskName}</Text>
        </Card>
      </CardBody>
    </Card>
  );
}
