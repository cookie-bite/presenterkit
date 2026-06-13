import type { Metadata } from 'next';

import { UploadScreen } from './UploadScreen';

export const metadata: Metadata = { title: 'Upload' };

type Props = {
  searchParams: Promise<{ token?: string }>;
};

export default async function UploadPage({ searchParams }: Props) {
  const { token } = await searchParams;
  return <UploadScreen token={token ?? ''} />;
}
