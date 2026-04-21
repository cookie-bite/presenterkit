'use client';

import { useLogout } from '@/lib/hooks/useAuth';
import { Button } from '@/ui';

import { Container, Title } from './styled';

export const Menu = () => {
  const { mutate: logout, isPending } = useLogout();

  return (
    <Container>
      <Title>PresenterKit</Title>
      <Button variant='text' onClick={() => logout()} disabled={isPending}>
        Logout
      </Button>
    </Container>
  );
};
