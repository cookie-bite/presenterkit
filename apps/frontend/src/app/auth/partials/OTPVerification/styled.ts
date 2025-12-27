import styled from 'styled-components';

export const OTP = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 350px;
  margin-top: 20px;
`;

export const OTPHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const OTPHeaderTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const OTPHeaderSubtitle = styled.h3`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 5px;
  margin-bottom: 0;
`;

export const OTPHeaderEmail = styled.strong`
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const ErrorMessageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  max-width: 350px;
  padding: 12px 0;
  margin-top: 10px;
`;
