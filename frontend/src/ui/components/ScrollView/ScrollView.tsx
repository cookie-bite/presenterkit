import { StyledScrollView } from "./ScrollView.styled";
import { ScrollViewProps } from "./ScrollView.types";

export const ScrollView = ({
  direction,
  children,
  $gap,
  $padding,
}: ScrollViewProps) => {
  return (
    <StyledScrollView direction={direction} $gap={$gap} $padding={$padding}>
      <>{children}</>
    </StyledScrollView>
  );
};
