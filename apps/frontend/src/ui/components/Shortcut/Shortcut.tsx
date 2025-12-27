'use client';

import { useMemo } from 'react';

import { ShortcutContainer, ShortcutKey } from './Shortcut.styled';
import {
  getKeyIcon,
  getKeyTitle,
  getPlatform,
  type ShortcutKey as ShortcutKeyType,
  type ShortcutProps,
} from './Shortcut.types';

export function Shortcut({ keys, type = 'icon' }: ShortcutProps) {
  const platform = useMemo(() => getPlatform(), []);

  const renderKey = (key: ShortcutKeyType, index: number) => {
    const displayText = type === 'icon' ? getKeyIcon(key, platform) : getKeyTitle(key, platform);

    return <ShortcutKey key={index}>{displayText}</ShortcutKey>;
  };

  return <ShortcutContainer>{keys.map(renderKey)}</ShortcutContainer>;
}
