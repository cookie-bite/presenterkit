import { DisplayScreen } from './DisplayScreen';

export default async function DisplayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DisplayScreen displayId={id} />;
}
