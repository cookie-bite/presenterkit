import { FileResponse } from '@/lib/api/file.api';
import { Icon } from '@/ui';

import { Stage } from '../../styled';
import { AudioContainer, AudioPlayer, IconWrapper } from './styled';

interface AudioViewerProps {
  file: FileResponse;
}

export const AudioViewer = ({ file }: AudioViewerProps) => (
  <Stage>
    <AudioContainer>
      <IconWrapper>
        <Icon name='musical-notes' size={48} color='text.tertiary' />
      </IconWrapper>
      <AudioPlayer controls playsInline src={file.blobUrl ?? ''} />
    </AudioContainer>
  </Stage>
);
