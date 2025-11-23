import styled from "styled-components";

import { ResponsiveImage } from "@/ui/components/ResponsiveImage";

export const File = styled.div`
  flex-direction: column;
  padding: 0 8px;
`

export const Title = styled.h3`
  margin-bottom: 4px;
  ${({ theme }) => theme.text.title3.regular}
`

export const Preview = styled(ResponsiveImage)`
  border-radius: ${({ theme }) => theme.radius.lg};
`