"use client";

import { Panel, PanelGroup } from "react-resizable-panels";
import { Container, PanelResizer } from "./styled";
import { Files } from "./partials/Files";
import { Displays } from "./partials/Displays";
import { Stage } from "./partials/Stage/Stage";
import { Menu } from "./partials/Menu";

export default function Dashboard() {
  return (
    <Container>
      <Menu />
      <PanelGroup direction="horizontal">
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
    </Container>
  );
}
