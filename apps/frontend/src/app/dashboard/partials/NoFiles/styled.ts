import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  gap: 32px;
  padding: 8px;
`;

export const BlackWhiteImage = styled.img`
  filter: grayscale(100%) brightness(0.4);
  width: 150px;
  height: 150px;
`;

export const Commands = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Command = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 48px;
  padding: 4px 4px 4px 8px;
  border-radius: ${({ theme }) => theme.radius.lg};
  ${({ theme }) => theme.text.headline.regular}

  &:hover {
    background: ${({ theme }) => theme.colors.fill.quaternary};
  }

  &:active {
    background: ${({ theme }) => theme.colors.fill.tertiary};
  }
`;
