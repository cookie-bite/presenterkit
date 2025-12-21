import styled from 'styled-components';
import { motion } from 'framer-motion';

export const SegmentsContainer = styled.div`
  display: flex;
  padding: 4px;
  border: 1px solid ${({ theme }) => theme.colors.fill.secondary};
  border-radius: ${({ theme }) => theme.radius.xxl};
  background-color: ${({ theme }) => theme.colors.fill.tertiary};
  z-index: 1;
`;

export const SegmentButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: max-content;
  height: 26px;
  padding: 0 10px;
  border-radius: ${({ theme }) => theme.radius.lg};
  line-height: 24px;
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent.blue};
    outline-offset: 2px;
  }
`;

export const SegmentBackground = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 26px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background-color: ${({ theme }) => theme.colors.fill.primary};
  z-index: -1;
`;

