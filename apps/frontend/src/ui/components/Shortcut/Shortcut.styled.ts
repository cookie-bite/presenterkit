import styled from 'styled-components';

export const ShortcutContainer = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

export const ShortcutKey = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.background.tertiary};
  border: 1px solid ${({ theme }) => theme.colors.separator.nonOpaque};
  box-shadow: inset 0 -1px 1px 0px ${({ theme }) => theme.colors.grays.gray6};
  ${({ theme }) => theme.text.callout.regular}
`;
