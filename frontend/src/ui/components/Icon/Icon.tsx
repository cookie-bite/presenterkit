import type { SVGProps } from 'react';
import React from 'react';

import * as allIcons from './Icon.icons';
import { StyledIconWrapper, ThemeColorPath } from './Icon.styled';
export const icons = allIcons;
export type IconName = keyof typeof allIcons;

interface IconProps {
  name: IconName;
  size?: number;
  color?: ThemeColorPath; // | string; // Type-safe theme colors + fallback to any string
  style?: React.CSSProperties;
}

export const Icon = ({ name, size = 20, color = 'text.primary', style }: IconProps) => {
  const SvgIcon = icons[name] as React.FC<SVGProps<SVGSVGElement>>;
  if (!SvgIcon) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <StyledIconWrapper $size={size} $color={color} style={style}>
      <SvgIcon
        width={size}
        height={size}
        viewBox='0 0 512 512'
        fill='currentColor' // Let styled-component handle the color
      />
    </StyledIconWrapper>
  );
};
