import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  width: 100%;
  padding: 8px;
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.background.secondary};
`;

export const Track = styled.div<{
  $isFileDragActive?: boolean;
  $isOver?: boolean;
  $isEmpty?: boolean;
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  gap: 8px;
  padding: 16px 8px;
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
  height: 110px;
  ${({ theme }) => theme.text.body.regular}
  color: ${({ theme }) => theme.colors.text.tertiary};
  pointer-events: none;
  user-select: none;
`;
