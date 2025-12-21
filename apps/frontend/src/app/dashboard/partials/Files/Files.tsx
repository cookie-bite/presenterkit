import { Icon } from '@/ui/components/Icon';
import { Panel } from '@/ui/components/Panel';
import { ScrollView } from '@/ui/components/ScrollView';

import { File, Preview, Title } from './styled';

const files = Array.from({ length: 7 }, (_, i) => ({
  title: `Keynote ${i}`,
  src: '/images/1.webp',
  alt: `File ${i}`,
}));

export const Files = () => {
  return (
    <Panel title='Files'>
      <ScrollView $gap='12px' $padding='8px 0'>
        {files.map(file => (
          <File key={file.title}>
            <Title>{file.title}</Title>
            <Preview src={file.src} alt={file.alt} width={500} height={500} />
          </File>
        ))}
      </ScrollView>
    </Panel>
  );
};
