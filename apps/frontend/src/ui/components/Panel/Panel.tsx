import { Actions, Content, Header, StyledPanel, Title } from './Panel.styled';
import { PanelProps } from './Panel.types';

export const Panel = ({ title, actions, children }: PanelProps) => {
  return (
    <StyledPanel>
      <Header>
        {title && <Title>{title}</Title>}
        {actions && <Actions>{actions}</Actions>}
      </Header>
      <Content>{children}</Content>
    </StyledPanel>
  );
};
