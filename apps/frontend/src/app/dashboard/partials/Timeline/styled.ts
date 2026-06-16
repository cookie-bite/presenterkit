import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 8px;
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.background.secondary};
`;

export const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 0 4px 4px;
`;

export const ZoomRange = styled.input`
  width: 80px;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors.accent.blue};
`;

export const TracksWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  gap: 4px;
`;

export const Track = styled.div<{
  $isFileDragActive?: boolean;
  $isOver?: boolean;
  $isEmpty?: boolean;
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  min-width: 100%;
  width: max-content;
  gap: 8px;
  padding: 8px;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px dashed
    ${({ theme, $isFileDragActive, $isOver, $isEmpty }) =>
      $isFileDragActive || $isOver || $isEmpty ? theme.colors.separator.nonOpaque : 'transparent'};
  background: ${({ theme, $isFileDragActive, $isOver }) =>
    $isOver
      ? theme.colors.fill.tertiary
      : $isFileDragActive
        ? theme.colors.fill.quaternary
        : 'transparent'};
  transition:
    background 0.15s ease,
    border-color 0.15s ease;
`;

export const TrackLabel = styled.div`
  ${({ theme }) => theme.text.caption2.regular}
  color: ${({ theme }) => theme.colors.text.tertiary};
  flex-shrink: 0;
  width: 48px;
  text-align: right;
  padding-right: 8px;
  user-select: none;
`;

export const TrackRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const AudioTrack = styled.div<{
  $isFileDragActive?: boolean;
  $isOver?: boolean;
  $isEmpty?: boolean;
  $width: number;
}>`
  position: relative;
  flex-shrink: 0;
  width: ${({ $width }) => $width}px;
  min-width: 100%;
  height: 80px;
  padding: 8px 0;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px dashed
    ${({ theme, $isFileDragActive, $isOver, $isEmpty }) =>
      $isFileDragActive || $isOver || $isEmpty ? theme.colors.separator.nonOpaque : 'transparent'};
  background: ${({ theme, $isFileDragActive, $isOver }) =>
    $isOver
      ? theme.colors.fill.tertiary
      : $isFileDragActive
        ? theme.colors.fill.quaternary
        : 'transparent'};
  transition:
    background 0.15s ease,
    border-color 0.15s ease;
`;

export const EmptyHint = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 80px;
  ${({ theme }) => theme.text.body.regular}
  color: ${({ theme }) => theme.colors.text.tertiary};
  pointer-events: none;
  user-select: none;
`;
