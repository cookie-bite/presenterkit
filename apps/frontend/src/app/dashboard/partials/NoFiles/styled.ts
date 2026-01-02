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

export const UploadArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 48px 32px;
  border: 1px dashed ${({ theme }) => theme.colors.accent.indigo};
  border-radius: ${({ theme }) => theme.radius.lg};
  background-color: ${({ theme }) => theme.colors.shade.indigo};
  transition: all 0.2s ease;
  cursor: pointer;
  ${({ theme }) => theme.text.headline.regular}
  color: ${({ theme }) => theme.colors.text.primary};
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
  background: transparent;

  &:hover {
    background: ${({ theme }) => theme.colors.fill.quaternary};
  }

  &:active {
    background: ${({ theme }) => theme.colors.fill.tertiary};
  }
`;
