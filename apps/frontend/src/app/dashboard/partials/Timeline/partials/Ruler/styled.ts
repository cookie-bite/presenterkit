import styled from 'styled-components';

export const RulerTrack = styled.div`
  position: relative;
  flex: 1;
  flex-shrink: 0;
  height: 20px;
  min-width: max-content;
  margin-bottom: 16px;
`;

/** In-flow sizer so min-width: max-content matches the main track width. */
export const RulerSizer = styled.div<{ $width: number }>`
  width: ${({ $width }) => $width}px;
  min-width: 100%;
  height: 0;
  visibility: hidden;
  pointer-events: none;
`;

export const Tick = styled.div<{ $left: number }>`
  position: absolute;
  bottom: 0;
  left: ${({ $left }) => $left}px;
  display: flex;
  flex-direction: row;
  align-items: center;
  pointer-events: none;
  user-select: none;
`;

export const TickLabel = styled.span`
  ${({ theme }) => theme.text.caption2.regular}
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin-left: 4px;
  white-space: nowrap;
`;

export const TickMark = styled.div`
  width: 1px;
  height: 14px;
  background: ${({ theme }) => theme.colors.separator.nonOpaque};
`;
