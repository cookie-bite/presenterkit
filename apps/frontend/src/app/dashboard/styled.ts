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

export const SaveFailedHint = styled.span`
  ${({ theme }) => theme.text.caption1.regular}
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const EmptyHint = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
  ${({ theme }) => theme.text.body.regular}
  color: ${({ theme }) => theme.colors.text.tertiary};
  pointer-events: none;
  user-select: none;
`;

export const PanelResizer = styled(PanelResizeHandle)`
  /* In horizontal group: left-right split => vertical line */
  [data-panel-group-direction='horizontal'] & {
    width: 8px;
    min-height: 100%;
  }
  /* In vertical group: top-bottom split => horizontal line */
  [data-panel-group-direction='vertical'] & {
    height: 8px;
  }
`;
