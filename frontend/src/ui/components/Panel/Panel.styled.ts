import styled from "styled-components";

export const StyledPanel = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.material.medium};
`;

export const Header = styled.div`
  padding: 4px 8px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.text.quaternary};
`;

export const Title = styled.h1`
  ${({ theme }) => theme.text.largeTitle.bold};
`;

export const Content = styled.div`
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;