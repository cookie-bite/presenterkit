import styled, { css, keyframes } from 'styled-components';

import { ResponsiveImage } from '@/ui';

const selectOverlay = keyframes`
  from { margin: -4px; opacity: 1; transform: scale(1); }
  to   { margin: 0;    opacity: 0; transform: scale(1); }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  75% { transform: translateX(100%); }
  100% { transform: translateX(100%); }
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

export const UploadCard = styled.div`
  position: relative;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  border-radius: ${({ theme }) => theme.radius.lg};
  background-color: ${({ theme }) => theme.colors.fill.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.text.title3.bold};
  color: ${({ theme }) => theme.colors.text.secondary};

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.fill.transparent} 0%,
      ${({ theme }) => theme.colors.fill.primary} 80%,
      ${({ theme }) => theme.colors.fill.transparent} 100%
    );
    transform: translateX(-100%);
    animation: ${shimmer} 2s ease-in-out infinite;
  }

  @media (prefers-reduced-motion) {
    &::after {
      display: none;
    }
  }
`;
