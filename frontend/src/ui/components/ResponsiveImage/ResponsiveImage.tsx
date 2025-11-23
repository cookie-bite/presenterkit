import { ImageProps } from 'next/image';

import { StyledImage } from './ResponsiveImage.styled';

export const ResponsiveImage = (props: ImageProps) => {
  return <StyledImage {...props} />;
};
