import styled, { css, keyframes } from 'styled-components';

import { ResponsiveImage } from '@/ui';

const selectOverlay = keyframes`
  from { margin: -4px; opacity: 1; transform: scale(1); }
  to   { margin: 0;    opacity: 0; transform: scale(1); }
`;

export const File = styled.div<{ $isSelected?: boolean }>`
  position: relative;
  flex-direction: column;
  padding: 4px;
  border-radius: ${({ theme }) => theme.radius.xl};
  cursor: pointer;
  background: ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.fill.secondary : 'transparent'};
`;

export const FileHoverOverlay = styled.div<{ $isSelected?: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: -4px;
  border-radius: inherit;
  background: ${({ theme }) => theme.colors.fill.tertiary};
  opacity: 0;
  transform: scale(0.9);
  will-change: opacity, transform;
  transition-property: opacity, transform;
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0.05, 0, 0, 1);
  pointer-events: none;
  z-index: 0;

  ${File}:hover & {
    opacity: ${({ $isSelected }) => ($isSelected ? 0 : 1)};
    transform: ${({ $isSelected }) => ($isSelected ? 'scale(0.9)' : 'scale(1)')};
  }

  ${({ $isSelected }) =>
    $isSelected &&
    css`
      animation: ${selectOverlay} 0.3s cubic-bezier(0.05, 0, 0, 1) forwards;
    `}
`;

export const Title = styled.h3`
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${({ theme }) => theme.text.callout.bold}
  color: ${({ theme }) => theme.colors.text.secondary};
  z-index: 0;
`;

export const Thumbnail = styled(ResponsiveImage)`
  border-radius: ${({ theme }) => theme.radius.lg};
  z-index: 0;
`;
