import styled from 'styled-components';

export const Image = styled.img`
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  border-radius: ${({ theme }) => theme.radius.lg};
`;
