'use client';

import { useState } from 'react';

import { FileResponse } from '@/lib/api/file.api';
import { Button, Icon } from '@/ui';

import { Stage } from '../../styled';
import { Container, Controls, Counter, Slide, Strip, Thumb, ThumbImg } from './styled';

interface SlideViewerProps {
  file: FileResponse;
}

function getPageImageUrl(thumbnailUrl: string, page: number): string {
  const padded = String(page).padStart(3, '0');
  return thumbnailUrl.replace(/\d{3}\.webp$/, `${padded}.webp`);
}

export const SlideViewer = ({ file }: SlideViewerProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const pageCount = file.pageCount ?? 1;
  const thumbnailUrl = file.thumbnailUrl ?? '';
  const pageImageUrl = getPageImageUrl(thumbnailUrl, currentPage);

  const goTo = (page: number) => setCurrentPage(Math.min(Math.max(1, page), pageCount));

  return (
    <Container>
      <Stage>
        <Slide src={pageImageUrl} alt={`Page ${currentPage} of ${file.filename ?? 'file'}`} />
      </Stage>

      <Controls>
        <Button variant='icon' onClick={() => goTo(currentPage - 1)} disabled={currentPage === 1}>
          <Icon name='chevron-back' size={16} />
        </Button>
        <Counter>
          {currentPage} / {pageCount}
        </Counter>
        <Button
          variant='icon'
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage === pageCount}
        >
          <Icon name='chevron-forward' size={16} />
        </Button>
      </Controls>

      <Strip>
        {Array.from({ length: pageCount }, (_, i) => i + 1).map(page => (
          <Thumb key={page} $isActive={page === currentPage} onClick={() => goTo(page)}>
            <ThumbImg src={getPageImageUrl(thumbnailUrl, page)} alt={`Page ${page}`} />
          </Thumb>
        ))}
      </Strip>
    </Container>
  );
};
