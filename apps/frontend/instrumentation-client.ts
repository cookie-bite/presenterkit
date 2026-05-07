import posthog from 'posthog-js';

import { IS_POSTHOG_ENABLED } from '@/lib/constants';

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (IS_POSTHOG_ENABLED && posthogKey) {
  posthog.init(posthogKey, {
    api_host: '/ingest',
    ui_host: process.env.NEXT_PUBLIC_POSTHOG_UI_HOST,
    defaults: '2026-01-30',
    capture_exceptions: true,
    debug: process.env.NODE_ENV === 'development',
  });
} else if (
  process.env.NODE_ENV === 'development' &&
  IS_POSTHOG_ENABLED &&
  !posthogKey
) {
  console.warn(
    '[PostHog] NEXT_PUBLIC_POSTHOG_ENABLED is true but NEXT_PUBLIC_POSTHOG_KEY is missing; analytics disabled.',
  );
}
