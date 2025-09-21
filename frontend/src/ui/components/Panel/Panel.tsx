import { Content, Header, StyledPanel, Title } from "./Panel.styled";
import { PanelProps } from "./Panel.types";

export const Panel = ({ title, children }: PanelProps) => {
  return (
    <StyledPanel>
      <Header>{title && <Title>{title}</Title>}</Header>
      <Content>{children}</Content>
    </StyledPanel>
  );
};
