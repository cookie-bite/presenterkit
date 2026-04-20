'use client';

import { useState } from 'react';

import { FileResponse } from '@/lib/api/file.api';

import { MainPageArea } from '../../styled';
import {
  Container,
  PageControlButton,
  PageControls,
  PageCounter,
  PageImage,
  ThumbnailImage,
  ThumbnailItem,
  ThumbnailStrip,
} from './styled';

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
      <MainPageArea>
        <PageImage src={pageImageUrl} alt={`Page ${currentPage} of ${file.filename ?? 'file'}`} />
      </MainPageArea>

      <PageControls>
        <PageControlButton onClick={() => goTo(currentPage - 1)} disabled={currentPage === 1}>
          ‹
        </PageControlButton>
        <PageCounter>
          {currentPage} / {pageCount}
        </PageCounter>
        <PageControlButton
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage === pageCount}
        >
          ›
        </PageControlButton>
      </PageControls>

      <ThumbnailStrip>
        {Array.from({ length: pageCount }, (_, i) => i + 1).map(page => (
          <ThumbnailItem key={page} $isActive={page === currentPage} onClick={() => goTo(page)}>
            <ThumbnailImage src={getPageImageUrl(thumbnailUrl, page)} alt={`Page ${page}`} />
          </ThumbnailItem>
        ))}
      </ThumbnailStrip>
    </Container>
  );
};
