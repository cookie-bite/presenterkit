import styled from 'styled-components';
import { motion } from 'framer-motion';

export const StyledErrorMessage = styled(motion.h4)`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.accent.red};
  margin-bottom: 0;
  text-align: center;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

