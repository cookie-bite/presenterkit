import posthog from 'posthog-js';

import { IS_POSTHOG_ENABLED } from '@/lib/constants';

/** Custom event names (PostHog dashboard / funnels). */
export const AnalyticsEvents = {
  clipAddedToTimeline: 'clip_added_to_timeline',
  clipRemovedFromTimeline: 'clip_removed_from_timeline',
  clipReorderedInTimeline: 'clip_reordered_in_timeline',
  displayOpened: 'display_opened',
  displayStepNavigated: 'display_step_navigated',
  emailVerified: 'email_verified',
  fileSelected: 'file_selected',
  fileUploaded: 'file_uploaded',
  userLoggedOut: 'user_logged_out',
  userSignedIn: 'user_signed_in',
  userSignedInWithGoogle: 'user_signed_in_with_google',
  userSignedUp: 'user_signed_up',
} as const;

export type AnalyticsEventName = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];

export function trackEvent(
  name: AnalyticsEventName | string,
  properties?: Record<string, unknown>,
) {
  if (!IS_POSTHOG_ENABLED) {
    return;
  }

  posthog.capture(name, properties);
}

export function identifyUser(distinctId: string, properties?: Record<string, unknown>) {
  if (!IS_POSTHOG_ENABLED) {
    return;
  }

  posthog.identify(distinctId, properties);
}

export function resetAnalyticsIdentity() {
  if (!IS_POSTHOG_ENABLED) {
    return;
  }

  posthog.reset();
}

export function capturePosthogException(error: unknown) {
  if (!IS_POSTHOG_ENABLED) {
    return;
  }

  posthog.captureException(error);
}
