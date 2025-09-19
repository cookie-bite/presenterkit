"use client";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import {
  Container,
  Displays,
  Files,
  Menu,
  PanelResizer,
  Preview,
  Toolbar,
} from "./styles";

export default function Home() {
  return (
    <Container>
      <Menu />
      <PanelGroup direction="horizontal">
        <Panel defaultSize={20}>
          <Files>
            <h1>Files</h1>
          </Files>
        </Panel>
        <PanelResizer />
        <Panel>
          <Preview>
            <Toolbar />
            <h1>Preview</h1>
          </Preview>
        </Panel>
        <PanelResizer />
        <Panel defaultSize={20}>
          <Displays>
            <h1>Displays</h1>
          </Displays>
        </Panel>
      </PanelGroup>
    </Container>
  );
}
