import styled from 'styled-components';

export const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #fff;
  color: #3c4043;
  border-radius: ${({ theme }) => theme.radius.lg};
  width: 100%;
  min-height: 40px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, box-shadow 0.2s;

  &:hover {
    background-color: #f8f9fa;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  &:active {
    background-color: #f1f3f4;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
