import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.background.secondary};
`;

export const ActionsRow = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 4px;
  gap: 8px;
  pointer-events: none;

  & > * {
    pointer-events: auto;
  }
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border-radius: ${({ theme }) => theme.radius.full};
  flex-shrink: 0;
  background-color: ${({ theme }) => theme.colors.fill.tertiary};
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  box-shadow:
    inset 0 0 0.5px 1px hsla(0, 0%, 100%, 0.1),
    0 3px 5px 1px #0004;
`;

export const ZoomRange = styled.input`
  width: 80px;
  height: 24px;
  margin: 0 4px;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors.accent.blue};
`;

export const TracksWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  margin-left: 8px;
  padding-right: 8px;
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
  flex: 1;
  min-width: max-content;
  min-height: calc(80px + 16px);
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
        : theme.colors.material.medium};
  transition:
    background 0.15s ease,
    border-color 0.15s ease;
`;

export const TrackLabel = styled.div`
  position: sticky;
  left: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  align-self: stretch;
  flex-shrink: 0;
  box-sizing: border-box;
  padding: 0 16px 0 8px;
  user-select: none;
  background: ${({ theme }) => theme.colors.background.secondary};
`;

export const TrackRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  min-width: 100%;
`;

export const AudioTrack = styled.div<{
  $isFileDragActive?: boolean;
  $isOver?: boolean;
  $isEmpty?: boolean;
  $width: number;
}>`
  position: relative;
  flex: 1;
  min-width: ${({ $width }) => $width}px;
  height: 28px;
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

export const EmptyHint = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.text.body.regular}
  color: ${({ theme }) => theme.colors.text.tertiary};
  pointer-events: none;
  user-select: none;
`;
