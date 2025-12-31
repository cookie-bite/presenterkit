import { Icon, Shortcut } from '@/ui';

import { BlackWhiteImage, Command, Commands, Container } from './styled';

export const NoFiles = () => {
  return (
    <Container>
      {/* <BlackWhiteImage src='/images/logo.svg' alt='Logo' /> */}
      <Icon name='folder-open' size={100} color='text.tertiary' />
      <Commands>
        <Command>
          Upload File
          <Shortcut keys={['shift', 'command', 'U']} />
        </Command>
      </Commands>
    </Container>
  );
};
