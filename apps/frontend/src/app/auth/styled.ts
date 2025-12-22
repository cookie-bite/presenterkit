import styled from 'styled-components';

import { Button } from '@/ui';
import { media } from '@/ui/theme/breakpoints';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;

export const Card = styled.div`
  display: flex;
  align-items: center;
  height: 600px;
  gap: 15px;
  padding: 15px;
  border-radius: ${({ theme }) => theme.radius.xxxl};
  box-shadow:
    inset 0 0 0.5px 1px ${({ theme }) => theme.colors.separator.nonOpaque},
    0 5px 10px 3px #0004;
  background-color: ${({ theme }) => theme.colors.background.secondary};

  ${media.mobile`
    background-color: transparent;
    box-shadow: none;
  `}
`;

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 570px;
  padding: 40px 40px 10px;

  ${media.mobile`
    height: 470px;
    padding: 0;
  `}
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 35px;
`;

export const LogoImage = styled.img`
  width: 80px;
  height: 80px;
`;

export const LogoTitle = styled.h3`
  font-size: 30px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const Banner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 430px;
  height: 100%;
  position: relative;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.fill.secondary};
  border-radius: ${({ theme }) => theme.radius.xl};
  background-color: ${({ theme }) => theme.colors.fill.quaternary};
  overflow: hidden;

  ${media.mobile`
    display: none;
  `}
`;

export const BannerImage = styled.img`
  height: 100%;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  filter: brightness(0.5);
`;

export const BannerTitle = styled.h2`
  text-align: center;
  font-size: 26px;
  font-weight: 600;
  margin-bottom: 30px;
  color: ${({ theme }) => theme.colors.text.primary};
  z-index: 1;
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

export const Divider = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 350px;
  margin: 20px 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
  font-weight: 500;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid ${({ theme }) => theme.colors.separator.nonOpaque};
  }

  &:not(:empty)::before {
    margin-right: 12px;
  }

  &:not(:empty)::after {
    margin-left: 12px;
  }
`;

export const SubmitButton = styled(Button)`
  margin-top: 10px;
`;
