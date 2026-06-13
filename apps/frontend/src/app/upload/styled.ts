import styled from 'styled-components';

import { Input } from '@/ui';
import { Button } from '@/ui/components/Button/Button';

export const Container = styled.div`
  min-height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.background.primary};
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 32px 28px;
  width: 340px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Heading = styled.h1`
  ${({ theme }) => theme.text.title1.bold}
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

export const Label = styled.label`
  ${({ theme }) => theme.text.callout.regular}
  color: ${({ theme }) => theme.colors.text.secondary};
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const TextInput = styled(Input)`
  width: 100%;
`;

export const FileButton = styled(Button).attrs({
  type: 'button',
  variant: 'primary',
})`
  width: 100%;
  gap: 8px;
  background: ${({ theme }) => theme.colors.fill.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  ${({ theme }) => theme.text.body.regular}
`;

export const SubmitButton = styled(Button).attrs({
  type: 'button',
  variant: 'primary',
})`
  width: 100%;
`;

export const StatusText = styled.p<{ $error?: boolean }>`
  ${({ theme }) => theme.text.footnote.regular}
  color: ${({ theme, $error }) => ($error ? theme.colors.accent.red : theme.colors.accent.green)};
  margin: 0;
  text-align: center;
`;
