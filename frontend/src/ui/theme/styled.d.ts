import 'styled-components';
import { colors, Mode } from './colors';
import { radius } from './radius';
import { text } from './text';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: typeof colors.light;
    radius: typeof radius;
    text: typeof text;
    mode: Mode;
  }
}
