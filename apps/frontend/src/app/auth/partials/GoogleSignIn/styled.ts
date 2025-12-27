import styled, { DefaultTheme } from 'styled-components';

import { Button } from '@/ui';

export const GoogleButton = styled(Button).attrs({
  spinnerColor: (theme: DefaultTheme) => theme.colors.grays.black,
})`
  gap: 8px;
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.colors.grays.white};
  color: #3c4043;
  font-size: 14px;
`;
