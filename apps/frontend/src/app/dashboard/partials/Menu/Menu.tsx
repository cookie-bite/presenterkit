'use client';

import { AnalyticsEvents, resetAnalyticsIdentity, trackEvent } from '@/lib/analytics';
import { useLogout } from '@/lib/hooks/useAuth';
import { Button } from '@/ui';

import { ShareLink } from './partials/Actions/ShareLink';
import { MenuPanel } from './partials/MenuPanel/MenuPanel';
import { Container, LeftGroup, Title } from './styled';

export const Menu = () => {
  const { mutate: logout, isPending } = useLogout();

  return (
    <Container>
      <LeftGroup>
        <Title>PresenterKit</Title>
        <MenuPanel triggerLabel='Actions'>
          <ShareLink />
        </MenuPanel>
      </LeftGroup>
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
