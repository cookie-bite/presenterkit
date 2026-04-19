import { ReactNode } from 'react';

export type PanelProps = {
  title?: string;
  actions?: ReactNode;
  children: ReactNode;
};
