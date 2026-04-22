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

export const Track = styled.div<{ $isOver?: boolean; $isEmpty?: boolean }>`
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
    ${({ theme, $isOver, $isEmpty }) =>
      $isOver || $isEmpty ? theme.colors.accent.indigo : 'transparent'};
  background: ${({ theme, $isOver }) => ($isOver ? theme.colors.shade.indigo : 'transparent')};
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
