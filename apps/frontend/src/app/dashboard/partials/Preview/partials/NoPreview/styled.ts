import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;

export const Text = styled.p`
  ${({ theme }) => theme.text.body.regular}
  color: ${({ theme }) => theme.colors.text.tertiary};
`;
