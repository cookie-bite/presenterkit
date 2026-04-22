import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  gap: 8px;
  overflow: hidden;
`;

export const ImageStep = styled.img`
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  border-radius: ${({ theme }) => theme.radius.lg};
`;

export const VideoStep = styled.video`
  max-width: 90%;
  max-height: 90%;
  border-radius: ${({ theme }) => theme.radius.lg};
`;

export const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 36px;
  flex-shrink: 0;
`;

export const Counter = styled.span`
  ${({ theme }) => theme.text.title3.bold}
  color: ${({ theme }) => theme.colors.text.secondary};
  width: 13ch;
  text-align: center;
  font-variant-numeric: tabular-nums;
`;
