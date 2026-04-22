import { PanelResizeHandle } from 'react-resizable-panels';
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  height: 100%;
  padding: 8px;
  margin: 0;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

export const PanelResizer = styled(PanelResizeHandle)`
  /* width: 8px; */

  /* In horizontal group: left-right split => vertical line */
  [data-panel-group-direction='horizontal'] & {
    width: 8px;
    min-height: 100%;
    /* cursor: col-resize; */
  }
  /* In vertical group: top-bottom split => horizontal line */
  [data-panel-group-direction='vertical'] & {
    height: 8px;
    /* cursor: row-resize; */
  }
`;
