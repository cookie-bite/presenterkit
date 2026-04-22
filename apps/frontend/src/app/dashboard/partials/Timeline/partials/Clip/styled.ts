import Image from 'next/image';
import styled from 'styled-components';

import { Button } from '@/ui';

export const Container = styled.div<{ $isSelected?: boolean }>`
  position: relative;
  flex-shrink: 0;
  height: 110px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.fill.secondary};
  overflow: hidden;
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

export const RemoveButton = styled(Button)`
  position: absolute;
  top: 2px;
  right: 0;
  z-index: 2;
  flex-shrink: 0;
`;

export const Thumbnail = styled(Image)`
  height: 100% !important;
  width: auto !important;
  display: block;
`;

export const ThumbnailPlaceholder = styled.div`
  height: 100%;
  width: 80px;
  background: ${({ theme }) => theme.colors.fill.secondary};
`;

// TODO: Add a separator between clips
export const Separator = styled.div`
  height: 32px;
  width: 6px;
  margin: 0 4px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.colors.fill.secondary};
`;
