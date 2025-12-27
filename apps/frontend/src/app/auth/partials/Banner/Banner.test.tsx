import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { render, screen } from '@/test-utils';

import { Banner } from './Banner';

describe('Banner', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders banner image', () => {
    render(<Banner />);

    const image = screen.getByAltText('Presentation');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/images/auth-banner-1.webp');
  });

  it('renders title text', () => {
    render(<Banner />);

    expect(screen.getByText(/Presentation and audience/)).toBeInTheDocument();
    expect(screen.getByText(/engagement in one SaaS/)).toBeInTheDocument();
  });

  it('cycles through images every 15 seconds', () => {
    render(<Banner />);

    // Initially shows first image
    let image = screen.getByAltText('Presentation');
    expect(image).toHaveAttribute('src', '/images/auth-banner-1.webp');

    // Advance time by 15 seconds and wrap in act()
    act(() => {
      vi.advanceTimersByTime(15000);
    });

    // Should show second image
    image = screen.getByAltText('Presentation');
    expect(image).toHaveAttribute('src', '/images/auth-banner-2.webp');

    // Advance time by another 15 seconds
    act(() => {
      vi.advanceTimersByTime(15000);
    });

    // Should show third image
    image = screen.getByAltText('Presentation');
    expect(image).toHaveAttribute('src', '/images/auth-banner-3.webp');

    // Advance time by another 15 seconds
    act(() => {
      vi.advanceTimersByTime(15000);
    });

    // Should cycle back to first image
    image = screen.getByAltText('Presentation');
    expect(image).toHaveAttribute('src', '/images/auth-banner-1.webp');
  });

  it('cleans up interval on unmount', () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
    const { unmount } = render(<Banner />);

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
