import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 30px;
  width: 100%;
  padding: 0 12px;
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.background.secondary};
`;

export const Title = styled.span`
  ${({ theme }) => theme.text.callout.bold}
  color: ${({ theme }) => theme.colors.text.primary};
  user-select: none;
`;
