'use client';

import { Panel, PanelGroup } from 'react-resizable-panels';

import { useFiles } from '@/lib/hooks/useFiles';

import { Displays } from './partials/Displays';
import { Files } from './partials/Files';
import { Menu } from './partials/Menu';
import { NoFiles } from './partials/NoFiles';
import { Preview } from './partials/Preview';
import { Container, PanelResizer } from './styled';

export default function Dashboard() {
  const { files, hasFiles } = useFiles();

  return (
    <Container>
      <Menu />
      {!hasFiles ? (
        <NoFiles />
      ) : (
        <PanelGroup direction='horizontal'>
          <Panel defaultSize={20}>
            <Files files={files} />
          </Panel>
          <PanelResizer />
          <Panel>
            <Preview />
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
