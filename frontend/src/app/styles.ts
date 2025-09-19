import styled from "styled-components";
import { PanelResizeHandle } from "react-resizable-panels";

const gap = '8px'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${gap};
  width: 100%;
  height: 100%;
  padding: ${gap};
  margin: 0;
  background: ${({ theme }) => theme.colors.material.medium};
`

export const Menu = styled.div`
  display: flex;
  height: 30px;
  width: 100%;
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.material.medium};
`;

export const PanelResizer = styled(PanelResizeHandle)`
  width: ${gap};
`

export const Files = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  padding: ${gap};
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.material.medium};
`;

export const Preview = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: ${gap};
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.material.thin};
`;

export const Toolbar = styled.div`
  display: flex;
  height: 40px;
  width: 100%;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.material.medium};
`;

export const Displays = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  padding: ${gap};
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.material.medium};
`;
