'use client';

import { useEffect } from 'react';
import { useAnimation } from 'framer-motion';
import { StyledErrorMessage } from './ErrorMessage.styled';
import type { ErrorMessageProps } from './ErrorMessage.types';

export function ErrorMessage({ children, animated = true }: ErrorMessageProps) {
  const controls = useAnimation();

  useEffect(() => {
    // Trigger animation whenever children is truthy, even if the value is the same
    if (animated && children !== undefined && children !== null && children !== '') {
      const animationValues = {
        x: [15 * 0.789, 15 * -0.478, 15 * 0.29, 15 * -0.176, 15 * 0.107, 15 * -0.065, 0],
      };
      controls.start(animationValues);
    }
  }, [children, animated, controls]);

  return <StyledErrorMessage animate={controls}>{children}</StyledErrorMessage>;
}

