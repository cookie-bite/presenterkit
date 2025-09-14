"use client";

import styled from "styled-components";

const Container = styled.div`
  background: ${({theme}) => theme.colors.material.thin}
`

const Card = styled.div`
  background: ${({ theme }) => theme.colors.fill.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  border: 1px solid ${({ theme }) => theme.colors.accent.blue};
`;

const Head = styled.h1`
  color: ${({ theme }) => theme.colors.accent.red};
`;

export default function Home() {
  return (
    <Container>
      <Card>
        <Head>New Arch</Head>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>
      </Card>
    </Container>
  );
}
