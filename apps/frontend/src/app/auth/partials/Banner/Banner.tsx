import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import { Container, Image, Title } from './styled';

const bannerImages = [
  '/images/auth-banner-1.webp',
  '/images/auth-banner-2.webp',
  '/images/auth-banner-3.webp',
];

const bannerDuration = 15;
const fadeDuration = 0.3;

export function Banner() {
  const [bannerIndex, setBannerIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setBannerIndex(prevIndex => (prevIndex + 1) % bannerImages.length);
    }, bannerDuration * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const currentBannerImage = bannerImages[bannerIndex];

  const imageVariants = {
    initial: { opacity: 0, scale: 1 },
    animate: {
      opacity: 1,
      scale: 1.05,
      transition: {
        opacity: { duration: fadeDuration },
        scale: { duration: bannerDuration, ease: 'linear' as const },
      },
    },
    exit: {
      opacity: 0,
      // scale: 1.25,
      transition: {
        opacity: { duration: fadeDuration },
        // scale: { duration: fadeDuration, ease: 'linear' as const },
      },
    },
  };

  return (
    <Container>
      <AnimatePresence mode='wait'>
        <Image
          key={bannerIndex}
          src={currentBannerImage}
          alt='Presentation'
          variants={imageVariants}
          initial='initial'
          animate='animate'
          exit='exit'
        />
      </AnimatePresence>
      <Title>
        Presentation and audience
        <br />
        engagement in one SaaS.
      </Title>
    </Container>
  );
}
