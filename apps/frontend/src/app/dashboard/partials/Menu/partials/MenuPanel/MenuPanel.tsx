'use client';

import { type ReactNode, useEffect, useRef, useState } from 'react';

import { Button } from '@/ui';

import { Panel, Wrapper } from './styled';

interface MenuPanelProps {
  triggerLabel: string;
  children: ReactNode;
}

export const MenuPanel = ({ triggerLabel, children }: MenuPanelProps) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [open]);

  return (
    <Wrapper ref={wrapperRef}>
      <Button variant='text' onClick={() => setOpen(prev => !prev)}>
        {triggerLabel}
      </Button>
      {open && <Panel>{children}</Panel>}
    </Wrapper>
  );
};
