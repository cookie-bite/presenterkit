import 'styled-components';
import { colors, Mode } from './colors';
import { radius } from './radius';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: typeof colors.light;
    radius: typeof radius;
    mode: Mode;
  }
}
