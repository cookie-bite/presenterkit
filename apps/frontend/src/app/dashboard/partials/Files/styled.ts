import styled, { keyframes } from 'styled-components';

import { ResponsiveImage } from '@/ui';

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  75% { transform: translateX(100%); }
  100% { transform: translateX(100%); }
`;

export const File = styled.div`
  flex-direction: column;
  padding: 0 8px;
`;

export const Title = styled.h3`
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${({ theme }) => theme.text.callout.bold}
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const Thumbnail = styled(ResponsiveImage)`
  border-radius: ${({ theme }) => theme.radius.lg};
`;

export const UploadCard = styled.div`
  position: relative;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  border-radius: ${({ theme }) => theme.radius.lg};
  background-color: ${({ theme }) => theme.colors.fill.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.text.title3.bold};
  color: ${({ theme }) => theme.colors.text.secondary};

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.fill.transparent} 0%,
      ${({ theme }) => theme.colors.fill.primary} 80%,
      ${({ theme }) => theme.colors.fill.transparent} 100%
    );
    transform: translateX(-100%);
    animation: ${shimmer} 2s ease-in-out infinite;
  }

  @media (prefers-reduced-motion) {
    &::after {
      display: none;
    }
  }
`;
