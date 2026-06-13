'use client';

import { useRef, useState } from 'react';

import { uploadViaLink } from '@/lib/api/upload-link.api';
import { useUploadPage } from '@/lib/hooks/useUploadLink';
import { Icon } from '@/ui';

import {
  Card,
  Container,
  FileButton,
  Heading,
  Label,
  StatusText,
  SubmitButton,
  TextInput,
} from './styled';

type State = 'ready' | 'uploading' | 'done' | 'error';

interface Props {
  token: string;
}

export const UploadScreen = ({ token }: Props) => {
  const { data, isLoading, isError } = useUploadPage(token);
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<State>('ready');
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  if (isLoading) {
    return (
      <Container>
        <StatusText>Loading…</StatusText>
      </Container>
    );
  }

  if (isError || !data) {
    return (
      <Container>
        <StatusText $error>This upload link is invalid or has been revoked.</StatusText>
      </Container>
    );
  }

  const handleSubmit = async () => {
    if (!file || state === 'uploading') return;
    setState('uploading');
    try {
      await uploadViaLink(token, file, name.trim() || 'Guest');
      setState('done');
      setFile(null);
      if (inputRef.current) inputRef.current.value = '';
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Upload failed');
      setState('error');
    }
  };

  return (
    <Container>
      <Card>
        <Heading>{data.eventName}</Heading>

        <Label>
          Your name (optional)
          <TextInput
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder='Guest'
            disabled={state === 'uploading'}
          />
        </Label>

        <Label>
          <input
            ref={inputRef}
            type='file'
            accept='image/*,video/*,.pdf,.ppt,.pptx'
            style={{ display: 'none' }}
            onChange={e => setFile(e.target.files?.[0] ?? null)}
          />
          <FileButton onClick={() => inputRef.current?.click()} disabled={state === 'uploading'}>
            <Icon name='cloud-upload-outline' size={16} color='text.primary' />
            {file ? file.name : 'Choose file…'}
          </FileButton>
        </Label>

        <SubmitButton onClick={handleSubmit} disabled={!file} isPending={state === 'uploading'}>
          Upload
        </SubmitButton>

        {state === 'done' && (
          <StatusText>Uploaded successfully. You can upload another.</StatusText>
        )}
        {state === 'error' && <StatusText $error>{errorMsg}</StatusText>}
      </Card>
    </Container>
  );
};
