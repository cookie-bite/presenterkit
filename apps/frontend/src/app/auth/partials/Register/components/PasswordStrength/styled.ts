import styled from 'styled-components';
import { motion } from 'framer-motion';

export const PasswordStrengthContainer = styled(motion.div)`
  display: flex;
  gap: 8px;
  margin-bottom: 5px;
`;

export const PasswordStrengthItem = styled.div<{ $isValid: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 30px;
  height: 25px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background-color: ${({ theme, $isValid }) =>
    $isValid ? theme.colors.shade.green : theme.colors.shade.red};
  transition: all 0.3s ease-in-out;

  h4 {
    font-size: 13px;
    font-weight: 500;
    color: ${({ theme, $isValid }) =>
      $isValid ? theme.colors.accent.green : theme.colors.accent.red};
    margin: 0;
  }
`;

export const Tooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 5px;
  padding: 4px 8px;
  /* border: 1px solid ${({ theme }) => theme.colors.fill.secondary}; */
  background-color: ${({ theme }) => theme.colors.fill.primary};
  backdrop-filter: saturate(180%) blur(20px);
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 12px;
  font-weight: 400;
  white-space: nowrap;
  border-radius: ${({ theme }) => theme.radius.sm};
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;

  ${PasswordStrengthItem}:hover & {
    opacity: 1;
  }

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: ${({ theme }) => theme.colors.fill.secondary};
  }
`;

