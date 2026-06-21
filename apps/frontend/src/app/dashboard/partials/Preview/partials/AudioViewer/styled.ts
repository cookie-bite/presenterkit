import styled from 'styled-components';

export const AudioContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  width: 100%;
  height: 100%;
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.fill.secondary};
`;

export const AudioPlayer = styled.audio`
  width: min(360px, 90%);
`;
