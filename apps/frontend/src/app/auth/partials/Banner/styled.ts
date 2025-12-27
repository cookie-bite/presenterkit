import { motion } from 'framer-motion';
import styled from 'styled-components';

import { media } from '@/ui/theme/breakpoints';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 430px;
  height: 100%;
  position: relative;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.fill.secondary};
  border-radius: ${({ theme }) => theme.radius.xl};
  background-color: ${({ theme }) => theme.colors.fill.quaternary};
  overflow: hidden;

  ${media.mobile`
    display: none;
  `}
`;

export const Image = styled(motion.img)`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: center;
  filter: brightness(0.5);
  object-fit: cover;
`;

export const Title = styled.h2`
  text-align: center;
  font-size: 26px;
  font-weight: 600;
  margin-bottom: 30px;
  color: ${({ theme }) => theme.colors.text.primary};
  z-index: 1;
`;
