import { css } from "styled-components";

export const breakpoints = {
  mobile: "1020px",
} as const;

export const media = {
  mobile: (styles: TemplateStringsArray, ...interpolations: any[]) => css`
    @media (max-width: ${breakpoints.mobile}) {
      ${css(styles, ...interpolations)}
    }
  `,
};

