import styled from 'styled-components';

export const Video = styled.video`
  max-width: 100%;
  max-height: 100%;
  border-radius: ${({ theme }) => theme.radius.lg};
`;
