'use client';

import { Panel, PanelGroup } from 'react-resizable-panels';

import { Displays } from './partials/Displays';
import { Files } from './partials/Files';
import { Menu } from './partials/Menu';
import { NoFiles } from './partials/NoFiles';
import { Stage } from './partials/Stage/Stage';
import { Container, PanelResizer } from './styled';

export default function Dashboard() {
  const noFiles = true;
  return (
    <Container>
      <Menu />
      {noFiles ? (
        <NoFiles />
      ) : (
        <PanelGroup direction='horizontal'>
          <Panel defaultSize={20}>
            <Files />
          </Panel>
          <PanelResizer />
          <Panel>
            <Stage />
          </Panel>
          <PanelResizer />
          <Panel defaultSize={20}>
            <Displays />
          </Panel>
        </PanelGroup>
      )}
    </Container>
  );
}
