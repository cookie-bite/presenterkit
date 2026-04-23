import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background: ${({ theme }) => theme.colors.grays.black};
`;

export const Stage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  overflow: hidden;
`;

export const ImageStep = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

export const VideoStep = styled.video`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

export const Status = styled.p`
  ${({ theme }) => theme.text.title3.regular}
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
  margin: auto;
`;
