import styled from 'styled-components';

export const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: ${({ theme }) => theme.radius.lg};
`;
