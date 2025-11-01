import styled from "styled-components";

export const StyledIconWrapper = styled.div<{ $size: number; $color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  flex-shrink: 0;

  svg {
    display: block;
    width: ${({ $size }) => $size}px;
    height: ${({ $size }) => $size}px;
    flex-shrink: 0;
    fill: ${({ $color, theme }) => getThemeColor(theme, $color)};
    /* stroke: ${({ $color, theme }) => getThemeColor(theme, $color)}; */
  }
`;

type ColorCategory = 'accent' | 'fill' | 'text' | 'material' | 'background';
type AccentColor = 'red' | 'orange' | 'yellow' | 'green' | 'mint' | 'teal' | 'cyan' | 'blue' | 'indigo' | 'purple' | 'pink' | 'gray' | 'brown';
type FillColor = 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary';
type TextColor = 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary';
type MaterialColor = 'ultrathick' | 'thick' | 'medium' | 'thin' | 'ultrathin';
type BackgroundColor = AccentColor;

export type ThemeColorPath =
  | `accent.${AccentColor}`
  | `fill.${FillColor}`
  | `text.${TextColor}`
  | `material.${MaterialColor}`
  | `background.${BackgroundColor}`;

const getThemeColor = (theme: any, colorPath: string): string => {
  try {
    const keys = colorPath.split('.');
    let result = theme.colors;

    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = result[key];
      } else {
        return colorPath; // Return original if path doesn't exist
      }
    }

    return typeof result === 'string' ? result : colorPath;
  } catch {
    return colorPath;
  }
};