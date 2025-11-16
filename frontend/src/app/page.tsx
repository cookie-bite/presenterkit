"use client";

import Image from "next/image";
import {
  Nav,
  NavContent,
  NavItem,
  NavHome,
  NavButton,
  Logo,
  LogoImageWrapper,
  LogoText,
  HeroSection,
  Hero,
  Title,
  Subtitle,
  CTAButton,
  ButtonInfo,
  ButtonInfoText,
  Video,
} from "./styled";

export default function Home() {
  return (
    <>
      <Nav>
        <NavContent>
          <NavHome href="#hero">
            <Logo>
              <LogoImageWrapper>
                <Image
                  src="/images/logo.svg"
                  alt="PresenterKit logo"
                  width={40}
                  height={40}
                />
              </LogoImageWrapper>
              <LogoText>PresenterKit</LogoText>
            </Logo>
          </NavHome>
          <NavItem href="#users">Users</NavItem>
          <NavItem href="#features">Features</NavItem>
          <NavItem href="#guide">Guide</NavItem>
          <NavItem href="#demo">Demo</NavItem>
          <NavButton>Get Started</NavButton>
        </NavContent>
      </Nav>

      <HeroSection id="hero">
        <Hero>
          <Title>
            Designed for Presenters.
            <br />
            Built for Impact.
          </Title>
          <Subtitle>
            Real-Time Interaction, Slide Sharing, and Presentation Management.
          </Subtitle>
          <CTAButton>Get Started</CTAButton>
          <ButtonInfo>
            <ButtonInfoText>It&apos;s completely free!</ButtonInfoText>
          </ButtonInfo>

          <Video
            muted
            autoPlay
            loop
            playsInline
            src="/videos/hero.mp4"
          />
        </Hero>
      </HeroSection>
    </>
  );
}
