import styled from 'styled-components';

import { Button } from '@/ui';

export const Container = styled.div<{ $isSelected?: boolean; $width: number; $left: number }>`
  position: absolute;
  top: 0;
  left: ${({ $left }) => $left}px;
  width: ${({ $width }) => $width}px;
  height: 100%;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  overflow: hidden;
`;

export const Label = styled.span`
  ${({ theme }) => theme.text.caption2.regular}
  color: ${({ theme }) => theme.colors.text.tertiary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 90%;
`;

export const RemoveButton = styled(Button)`
  position: absolute;
  top: 2px;
  right: 18px;
  z-index: 2;
  flex-shrink: 0;
`;
