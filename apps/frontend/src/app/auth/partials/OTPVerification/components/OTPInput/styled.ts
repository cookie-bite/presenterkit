import styled from 'styled-components';

export const OTPContainer = styled.div`
  display: flex;
  gap: 5px;
  margin: 10px 0 40px;
`;

export const OTPInput = styled.input<{ $hasError?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 500;
  text-align: center;
  width: 40px;
  height: 40px;
  border: 1px solid
    ${({ theme, $hasError }) => ($hasError ? theme.colors.accent.red : theme.colors.material.thin)};
  border-radius: ${({ theme }) => theme.radius.lg};
  background-color: ${({ theme }) => theme.colors.fill.quaternary};
  color: ${({ theme, $hasError }) =>
    $hasError ? theme.colors.accent.red : theme.colors.text.primary};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent.blue};
  }

  &:nth-child(3) {
    margin-right: 3px;
  }
`;
