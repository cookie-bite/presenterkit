import { FileResponse } from '@/lib/api/file.api';
import { Icon, Panel, ScrollView } from '@/ui';

import { File, Preview, Title } from './styled';

export const Files = ({ files }: { files: FileResponse[] }) => {
  return (
    <Panel title='Files'>
      <ScrollView $gap='12px' $padding='8px 0'>
        {files.map(file => (
          <File key={file.fileId}>
            <Title>{file.filename}</Title>
            <Preview
              src={file.thumbnailUrl ?? ''}
              alt={file.filename ?? ''}
              width={500}
              height={500}
            />
          </File>
        ))}
      </ScrollView>
    </Panel>
  );
};
