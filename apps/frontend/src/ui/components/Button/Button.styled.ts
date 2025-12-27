import type { DefaultTheme } from 'styled-components';
import styled, { keyframes } from 'styled-components';

const rotateSpinner = keyframes`
  0% {
    transform: rotate(0);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  min-height: 40px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background-color: ${({ theme }) => theme.colors.accent.indigo};
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.grays.white};
  border: none;
  box-shadow: inset 0 0 1px 1px ${({ theme }) => theme.colors.separator.nonOpaque};
  cursor: pointer;
  transition-property: transform;
  transition-duration: 0.15s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

  &:hover:not(:disabled) {
    filter: brightness(0.8);
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
    transition-property: transform;
  }

  &:disabled {
    filter: brightness(0.5) saturate(0.7);
    cursor: not-allowed;
  }
`;

export const Spinner = styled.div<{ $spinnerColor?: string | ((theme: DefaultTheme) => string) }>`
  display: inline-flex;
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top-color: ${({ theme, $spinnerColor }) =>
    $spinnerColor
      ? typeof $spinnerColor === 'function'
        ? $spinnerColor(theme)
        : $spinnerColor
      : theme.colors.grays.white};
  margin: 2px;
  animation: ${rotateSpinner} 0.7s linear infinite;
  border-radius: 100%;
`;
