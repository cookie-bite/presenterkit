import styled from "styled-components";
import { ScrollViewProps } from "./ScrollView.types";

export const StyledScrollView = styled.div<ScrollViewProps>`
  display: flex;
  flex-direction: ${({ direction }) => (direction === "horizontal" ? "row" : "column")};
  overflow-x: ${({ direction }) => (direction === "horizontal" ? "auto" : "hidden")};
  overflow-y: ${({ direction }) => (direction === "horizontal" ? "hidden" : "auto")};
  gap: ${({ $gap }) => $gap ?? 0};
  padding: ${({ $padding }) => $padding ?? 0};
`;