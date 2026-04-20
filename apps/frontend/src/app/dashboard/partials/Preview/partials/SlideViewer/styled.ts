import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  gap: 8px;
  overflow: hidden;
`;

export const PageImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: ${({ theme }) => theme.radius.lg};
`;

export const PageControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 36px;
  flex-shrink: 0;
`;

export const PageControlButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.colors.fill.secondary};
  ${({ theme }) => theme.text.title3.bold}
  color: ${({ theme }) => theme.colors.text.primary};
  transition: background 0.15s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.fill.primary};
  }

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
`;

export const PageCounter = styled.span`
  ${({ theme }) => theme.text.callout.regular}
  color: ${({ theme }) => theme.colors.text.secondary};
  width: 7ch;
  text-align: center;
  font-variant-numeric: tabular-nums;
`;

export const ThumbnailStrip = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  height: 72px;
  flex-shrink: 0;
  padding: 4px 2px;
  overflow-x: auto;
  overflow-y: hidden;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const ThumbnailItem = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 60px;
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  outline: 2px solid
    ${({ theme, $isActive }) => ($isActive ? theme.colors.accent.blue : 'transparent')};
  outline-offset: 1px;
  transition: outline-color 0.15s ease;
  cursor: pointer;
`;

export const ThumbnailImage = styled.img`
  height: 100%;
  width: auto;
  object-fit: cover;
`;
