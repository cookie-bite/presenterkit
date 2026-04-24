import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 8px;
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
