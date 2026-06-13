'use client';

import { useState } from 'react';

import { useEvent } from '@/lib/hooks/useEvent';
import { useCreateLink } from '@/lib/hooks/useUploadLink';
import { buildUploadUrl } from '@/lib/utils/upload-link';
import { Icon } from '@/ui';

import {
  MenuItem,
  MenuItemButton,
  MenuItemIcon,
  MenuItemLabel,
  MenuItemSpinner,
  MenuItemText,
} from '../MenuPanel/styled';

export const ShareLink = () => {
  const [copied, setCopied] = useState(false);
  const { event } = useEvent();
  const { mutate: createLink, isPending } = useCreateLink(event?.eventID ?? '');

  const uploadUrl = event?.uploadToken ? buildUploadUrl(event.uploadToken) : null;

  const handleGenerate = () => {
    createLink();
  };

  const handleCopy = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!uploadUrl) return;
    void navigator.clipboard.writeText(uploadUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (uploadUrl) {
    return (
      <MenuItem as='div' $interactive={false}>
        <MenuItemText title={uploadUrl}>{uploadUrl}</MenuItemText>
        <MenuItemButton onClick={handleCopy}>{copied ? 'Copied' : 'Copy'}</MenuItemButton>
      </MenuItem>
    );
  }

  return (
    <MenuItem type='button' $interactive={!isPending} disabled={isPending} onClick={handleGenerate}>
      <MenuItemIcon>
        {isPending ? (
          <MenuItemSpinner />
        ) : (
          <Icon name='share-outline' size={16} color='text.secondary' />
        )}
      </MenuItemIcon>
      <MenuItemLabel>Share link</MenuItemLabel>
    </MenuItem>
  );
};
