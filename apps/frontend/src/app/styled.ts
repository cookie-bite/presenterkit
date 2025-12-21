import styled from 'styled-components';

import { media } from '@/ui/theme/breakpoints';

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 20px;
  height: 56px;
  width: 100%;
  z-index: 1;

  ${media.mobile`
    top: 5px;
    transform: scale(0.55);
  `}
`;

export const NavContent = styled.div`
  flex-direction: row;
  gap: 2px;
  padding: 8px;
  border-radius: 28px;
  background-color: ${({ theme }) => theme.colors.fill.quaternary};
  -webkit-backdrop-filter: saturate(180%) blur(20px) !important;
  backdrop-filter: saturate(180%) blur(20px);
  box-shadow:
    inset 0 0 0.5px 1px hsla(0, 0%, 100%, 0.1),
    0 3px 5px 1px #0004;
`;

export const NavItem = styled.a`
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 20px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.landing.text};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.fill.quaternary};
  }
`;

export const NavHome = styled(NavItem)`
  padding-left: 5px;

  &:hover {
    background-color: transparent;
  }
`;

export const NavButton = styled.button`
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 20px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.landing.text};
  background-color: ${({ theme }) => theme.colors.accent.blue};
  cursor: pointer;

  &:hover {
    opacity: 0.6;
  }
`;

export const Logo = styled.div`
  flex-direction: row;
  align-items: center;
`;

export const LogoImageWrapper = styled.div`
  width: 40px;
  height: 40px;
  margin-right: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

export const LogoText = styled.h3`
  font-size: 21px;
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme.colors.landing.text};
`;

export const HeroSection = styled.section`
  padding: 160px 0 184px;
  margin-bottom: 0;
  background-color: ${({ theme }) => theme.colors.landing.background};
  overflow: hidden;

  ${media.mobile`
    padding: 60px 0 84px;
  `}
`;

export const Hero = styled.div`
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.h2`
  font-size: 80px;
  font-weight: 500;
  line-height: 84px;
  text-align: center;
  margin-top: 52px;
  margin-bottom: 0;
  color: ${({ theme }) => theme.colors.landing.text};

  ${media.mobile`
    font-size: 44px;
    line-height: 52px;
    margin-top: 38px;
  `}
`;

export const Subtitle = styled.h3`
  font-size: 32px;
  font-weight: 500;
  line-height: 36px;
  text-align: center;
  margin-top: 72px;
  width: 560px;
  max-width: 100%;
  margin-bottom: 0;
  color: ${({ theme }) => theme.colors.landing.text};

  ${media.mobile`
    font-size: 17px;
    line-height: 22px;
    margin-top: 38px;
    width: 80%;
  `}
`;

export const CTAButton = styled.button`
  font-size: 17px;
  font-weight: 500;
  padding: 11px 21px;
  border-radius: 1000px;
  margin: 72px 0 10px;
  background-color: ${({ theme }) => theme.colors.accent.blue};
  color: ${({ theme }) => theme.colors.landing.text};
  cursor: pointer;

  ${media.mobile`
    margin: 36px 0 10px;
  `}

  &:hover {
    opacity: 0.6;
  }
`;

export const ButtonInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 128px;

  ${media.mobile`
    margin-bottom: 64px;
  `}
`;

export const ButtonInfoText = styled.small`
  font-size: 13px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const Video = styled.video`
  width: 1020px;
  max-width: 100%;
  margin-bottom: 20px;
  border: 1px solid #fdfdfd4d;
  border-radius: 18px;
  box-shadow: 0 0 150px 50px #fff3;

  ${media.mobile`
    width: 80%;
    box-shadow: 0 0 110px 20px #fff3;
  `}
`;
