import { vi } from 'vitest';
import React from 'react';

// Make React available globally for all tests
(globalThis as any).React = React;

// Mock window.matchMedia for jsdom (used by ThemeProvider)
// This needs to be a function that returns a MediaQueryList-like object
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: (query: string) => {
    const mediaQueryList = {
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
    return mediaQueryList;
  },
});

// Import jest-dom - expect is available as a global with globals: true
import '@testing-library/jest-dom';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  const createMotionComponent = (tag: string) => {
    return React.forwardRef((props: any, ref: any) => {
      // Filter out framer-motion specific props that shouldn't be passed to DOM elements
      const {
        layoutId,
        layout,
        initial,
        animate,
        exit,
        variants,
        transition,
        whileHover,
        whileTap,
        whileFocus,
        whileDrag,
        whileInView,
        drag,
        dragConstraints,
        dragElastic,
        dragMomentum,
        dragPropagation,
        dragDirectionLock,
        dragTransition,
        onDrag,
        onDragStart,
        onDragEnd,
        ...domProps
      } = props;
      return React.createElement(tag, { ...domProps, ref });
    });
  };
  return {
    ...actual,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    motion: new Proxy({}, {
      get: (_target, prop: string) => {
        if (typeof prop === 'string') {
          return createMotionComponent(prop);
        }
        return undefined;
      },
    }),
  };
});

// Mock next/script
vi.mock('next/script', () => ({
  default: ({ onLoad, ...props }: any) => {
    if (onLoad) {
      setTimeout(() => onLoad(), 0);
    }
    return null;
  },
}));
