import styled from 'styled-components';

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  flex-shrink: 0;
  background-color: ${({ theme }) => theme.colors.fill.secondary};
  border-radius: ${({ theme }) => theme.radius.md};
`;

export const Item = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-shrink: 0;
`;

export const Label = styled.div`
  display: flex;
  justify-content: space-between;
  ${({ theme }) => theme.text.caption2.regular};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const Bar = styled.div<{ $progress: number }>`
  width: 100%;
  height: 2px;
  background-color: ${({ theme }) => theme.colors.fill.primary};
  border-radius: 1px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    transform-origin: left center;
    transform: scaleX(${({ $progress }) => $progress / 100});
    transition: transform 0.3s ease;
    background-color: ${({ theme }) => theme.colors.accent.green};
    border-radius: 1px;
  }

  @media (prefers-reduced-motion) {
    &::after {
      transition: none;
    }
  }
`;
