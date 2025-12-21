import type { Property } from 'csstype';
import { ReactNode } from 'react';

export type ScrollViewProps = {
  direction?: 'vertical' | 'horizontal';
  children: ReactNode;
  $gap?: Property.Gap;
  $padding?: Property.Padding;
};
