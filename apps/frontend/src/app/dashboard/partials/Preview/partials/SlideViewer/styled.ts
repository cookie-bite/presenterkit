import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  gap: 8px;
  overflow: hidden;
`;

export const Slide = styled.img`
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
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
  ${({ theme }) => theme.text.callout.regular}
  color: ${({ theme }) => theme.colors.text.secondary};
  width: 7ch;
  text-align: center;
  font-variant-numeric: tabular-nums;
`;

export const Strip = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 108px;
  flex-shrink: 0;
  padding: 6px 8px;
  overflow-x: auto;
  overflow-y: hidden;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Thumb = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 90px;
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  outline: 2px solid
    ${({ theme, $isActive }) => ($isActive ? theme.colors.accent.blue : 'transparent')};
  outline-offset: 2px;
  transition: outline-color 0.15s ease;
  cursor: pointer;
`;

export const ThumbImg = styled.img`
  height: 100%;
  width: auto;
  object-fit: cover;
`;
