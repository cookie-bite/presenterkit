import Image from 'next/image';
import styled from 'styled-components';

export const OverlayClipWrapper = styled.div`
  height: 120px;
  width: auto;
  display: inline-flex;
  flex-direction: column;
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  opacity: 0.9;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  background: ${({ theme }) => theme.colors.fill.primary};
  pointer-events: none;
`;

export const OverlayClipThumbnail = styled(Image)`
  height: 100% !important;
  width: auto !important;
  display: block;
`;
