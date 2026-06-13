import styled, { keyframes } from 'styled-components';

import { StyledButton } from '@/ui/components/Button/Button.styled';

export const Wrapper = styled.div`
  position: relative;
`;

export const Panel = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  min-width: 180px;
  max-width: 250px;
  width: 250px;
  padding: 4px;
  border-radius: ${({ theme }) => theme.radius.xl};
  background-color: ${({ theme }) => theme.colors.fill.quaternary};
  -webkit-backdrop-filter: saturate(180%) blur(20px) !important;
  backdrop-filter: saturate(180%) blur(20px);
  box-shadow:
    inset 0 0 0.5px 1px hsla(0, 0%, 100%, 0.1),
    0 3px 5px 1px #0004;
`;

// TODO: Separate spinner from Button component and reuse it here
const rotateSpinner = keyframes`
  0% { transform: rotate(0); }
  100% { transform: rotate(360deg); }
`;

export const MenuItem = styled.button<{ $interactive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: 28px;
  padding: 4px 8px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  background: transparent;
  cursor: ${({ $interactive }) => ($interactive ? 'pointer' : 'default')};
  user-select: none;
  overflow: hidden;
  text-align: left;

  &:hover {
    background: ${({ theme, $interactive }) =>
      $interactive ? theme.colors.fill.quaternary : 'transparent'};
  }

  &:disabled {
    cursor: default;
  }
`;

export const MenuItemButton = styled(StyledButton).attrs({
  variant: 'ghost',
  type: 'button',
})`
  flex-shrink: 0;
  ${({ theme }) => theme.text.callout.bold}
`;

export const MenuItemLabel = styled.span`
  ${({ theme }) => theme.text.callout.bold}
  color: ${({ theme }) => theme.colors.text.primary};
  white-space: nowrap;
`;

export const MenuItemText = styled.span`
  ${({ theme }) => theme.text.callout.regular}
  color: ${({ theme }) => theme.colors.text.secondary};
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const MenuItemIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
`;

export const MenuItemSpinner = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid transparent;
  border-top-color: ${({ theme }) => theme.colors.text.secondary};
  border-radius: 50%;
  animation: ${rotateSpinner} 0.7s linear infinite;
`;
