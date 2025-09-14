import 'styled-components';
import { colors, Mode } from './colors';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: typeof colors.light;
    mode: Mode;
  }
}
