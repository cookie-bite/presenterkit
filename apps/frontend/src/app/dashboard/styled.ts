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
  width: 8px;
`;
