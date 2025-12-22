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
  color: ${({ theme }) => theme.colors.text.primary};
  border: none;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover:not(:disabled) {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Spinner = styled.div`
  display: inline-flex;
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top-color: ${({ theme }) => theme.colors.grays.white};
  margin: 2px;
  animation: ${rotateSpinner} 0.7s linear infinite;
  border-radius: 100%;
`;

