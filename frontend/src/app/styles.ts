import styled from "styled-components";
import { PanelResizeHandle } from "react-resizable-panels";

// background: ${({theme}) => theme.colors.material.thin}
// background: ${({ theme }) => theme.colors.fill.primary};
// color: ${({ theme }) => theme.colors.text.primary};
// border: 1px solid ${({ theme }) => theme.colors.accent.blue};

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  height: 100%;
  padding: 10px;
  margin: 0;
  background: ${({ theme }) => theme.colors.material.medium};
`

export const Toolbar = styled.div`
  display: flex;
  height: 30px;
  width: 100%;
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.material.medium};
`;

export const PanelResizer = styled(PanelResizeHandle)`
  width: 10px;
`

export const Files = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.material.medium};
`;

export const Preview = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.material.thin};
`;

export const Displays = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.material.medium};
`;
