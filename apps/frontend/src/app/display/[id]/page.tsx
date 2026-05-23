import type { Metadata } from 'next';

import { DisplayScreen } from './DisplayScreen';

type DisplayPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ name?: string }>;
};

export async function generateMetadata({ searchParams }: DisplayPageProps): Promise<Metadata> {
  const { name } = await searchParams;
  const title = name?.trim();
  return { title: title || 'Display' };
}

export default async function DisplayPage({ params }: DisplayPageProps) {
  const { id } = await params;
  return <DisplayScreen displayId={id} />;
}
