'use client';

import { AnalyticsEvents, resetAnalyticsIdentity, trackEvent } from '@/lib/analytics';
import { useLogout } from '@/lib/hooks/useAuth';
import { Button } from '@/ui';

import { Container, Title } from './styled';

export const Menu = () => {
  const { mutate: logout, isPending } = useLogout();

  return (
    <Container>
      <Title>PresenterKit</Title>
      <Button
        variant='text'
        isPending={isPending}
        onClick={() => {
          trackEvent(AnalyticsEvents.userLoggedOut);
          resetAnalyticsIdentity();
          logout();
        }}
      >
        Logout
      </Button>
    </Container>
  );
};
