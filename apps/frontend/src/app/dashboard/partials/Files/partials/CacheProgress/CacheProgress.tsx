interface CacheProgressProps {
  fileDone: number;
  fileTotal: number;
  byteProgress: number | null;
}

import { Bar, Item, Label, Section } from './styled';

export const CacheProgress = ({ fileDone, fileTotal, byteProgress }: CacheProgressProps) => (
  <Section>
    <Item>
      <Label>
        <span>Files</span>
        <span>
          {fileDone}/{fileTotal}
        </span>
      </Label>
      <Bar $progress={Math.round((fileDone / fileTotal) * 100)} />
    </Item>
    <Item>
      <Label>
        <span>Bytes</span>
        <span>{byteProgress ?? 0}%</span>
      </Label>
      <Bar $progress={byteProgress ?? 0} />
    </Item>
  </Section>
);
