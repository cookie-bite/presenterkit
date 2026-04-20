import styled from 'styled-components';

export const Video = styled.video`
  max-width: 90%;
  max-height: 90%;
  border-radius: ${({ theme }) => theme.radius.lg};
`;
