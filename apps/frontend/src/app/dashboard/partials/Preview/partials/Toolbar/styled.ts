import styled from 'styled-components';

export const ToolbarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 40px;
  height: 40px;
  width: 100%;
  margin-bottom: 8px;
  padding: 4px 0px 4px 4px;
  border-radius: ${({ theme }) => theme.radius.lg};
`;

export const ToolbarTitle = styled.h2`
  ${({ theme }) => theme.text.title2.bold}
  color: ${({ theme }) => theme.colors.text.primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ToolbarActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border-radius: ${({ theme }) => theme.radius.full};
  flex-shrink: 0;
  background-color: ${({ theme }) => theme.colors.fill.tertiary};
`;
