import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  width: 100%;
  padding: 8px;
`;

export const EmptyHint = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  /* width: 100%; */
  height: 100%;
  ${({ theme }) => theme.text.body.regular}
  color: ${({ theme }) => theme.colors.text.tertiary};
  pointer-events: none;
  user-select: none;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

export const OfflineHint = styled.p`
  ${({ theme }) => theme.text.caption1.regular}
  color: ${({ theme }) => theme.colors.accent.orange};
`;
