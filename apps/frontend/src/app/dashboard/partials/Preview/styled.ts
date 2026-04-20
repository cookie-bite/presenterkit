import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 8px;
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.background.secondary};
`;

export const Toolbar = styled.div`
  display: flex;
  min-height: 40px;
  width: 100%;
  margin-bottom: 8px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.background.tertiary};
`;

export const MainPageArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.background.tertiary};
`;
