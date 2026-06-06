import styled, { css } from 'styled-components';

import { DisplayStatus } from '@/lib/stores/display.store';
import { Button } from '@/ui';

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.fill.secondary};
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Name = styled.h3`
  ${({ theme }) => theme.text.callout.bold}
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const StatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const StatusDot = styled.div<{ $status: DisplayStatus }>`
  width: 8px;
  height: 8px;
  border-radius: ${({ theme }) => theme.radius.full};

  ${({ theme, $status }) => {
    if ($status === 'connected') {
      return css`
        background: ${theme.colors.accent.green};
      `;
    }
    if ($status === 'blocked') {
      return css`
        background: ${theme.colors.accent.orange};
      `;
    }
    return css`
      background: ${theme.colors.text.tertiary};
    `;
  }}
`;

export const StatusText = styled.p`
  ${({ theme }) => theme.text.caption1.regular}
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const Preview = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.primary};
  overflow: hidden;
`;

export const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

export const PreviewVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

export const PreviewPlaceholder = styled.div`
  width: 100%;
  height: 100%;
`;

export const Controls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ControlsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export const NavControlsRow = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const Counter = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  ${({ theme }) => theme.text.footnote.regular}
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  pointer-events: none;
`;

export const ClickerAssignButton = styled(Button)<{ $active?: boolean }>`
  ${({ theme, $active }) =>
    $active &&
    css`
      background: ${theme.colors.accent.indigo};
      color: ${theme.colors.grays.white};

      &:hover:not(:disabled) {
        background: ${theme.colors.accent.indigo};
        filter: brightness(0.85);
      }
    `}
`;
