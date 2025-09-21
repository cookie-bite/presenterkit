import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  height: 30px;
  width: 100%;
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.material.medium};
`;