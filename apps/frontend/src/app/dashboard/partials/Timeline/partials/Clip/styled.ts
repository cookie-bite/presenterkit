import styled from 'styled-components';

import { Button } from '@/ui';

export const Container = styled.div<{ $isSelected?: boolean; $width: number }>`
  position: relative;
  flex-shrink: 0;
  width: ${({ $width }) => $width}px;
  height: 80px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.fill.secondary};
  overflow: visible;
  outline: 2px solid
    ${({ theme, $isSelected }) => ($isSelected ? theme.colors.accent.blue : 'transparent')};
  outline-offset: 2px;
  transition: outline-color 0.15s ease;
  cursor: grab;
  touch-action: none;
  user-select: none;

  &:active {
    cursor: grabbing;
  }
`;

export const Inner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  overflow: hidden;
`;

export const RemoveButton = styled(Button)<{ $offsetForResize?: boolean }>`
  position: absolute;
  top: 2px;
  right: ${({ $offsetForResize }) => ($offsetForResize ? '18px' : '2px')};
  z-index: 2;
  flex-shrink: 0;
`;

export const ThumbnailBg = styled.div<{ $url: string }>`
  height: 100%;
  width: 100%;
  background-image: url(${({ $url }) => $url});
  background-repeat: repeat-x;
  background-size: auto 100%;
  background-position: left center;
`;

export const ThumbnailPlaceholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background: ${({ theme }) => theme.colors.fill.secondary};
`;

export const ResizeHandle = styled.div`
  position: absolute;
  top: 0;
  right: -4px;
  width: 8px;
  height: 100%;
  cursor: ew-resize;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: '';
    width: 3px;
    height: 24px;
    border-radius: 2px;
    background: ${({ theme }) => theme.colors.fill.tertiary};
  }

  &:hover::after {
    background: ${({ theme }) => theme.colors.accent.blue};
  }
`;
