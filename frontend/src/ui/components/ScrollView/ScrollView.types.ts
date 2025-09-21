import { ReactNode } from "react";
import type { Property } from "csstype"

export type ScrollViewProps = {
  direction?: "vertical" | "horizontal";
  children: ReactNode;
  $gap?: Property.Gap;
  $padding?: Property.Padding
};