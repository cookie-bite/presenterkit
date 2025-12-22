import styled from 'styled-components';

export const InputContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

export const InputField = styled.input<{ $hasError?: boolean }>`
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 500;
  width: 330px;
  height: 40px;
  padding: 0 30px 0 10px;
  border: 1px solid ${({ theme }) => theme.colors.fill.secondary};
  border-radius: ${({ theme }) => theme.radius.xl};
  background-color: ${({ theme }) => theme.colors.fill.quaternary};
  color: ${({ theme, $hasError }) => ($hasError ? theme.colors.accent.red : theme.colors.text.primary)};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.text.tertiary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }
`;

export const InputIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 10px;
  height: 20px;
  cursor: pointer;
`;

