export const PUBLIC_ROUTES = {
  LANDING: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  LEGAL_TERMS: '/legal/terms',

  GUIDE_INSTALL: '/guide/install',
  ONBOARDING_CHARACTER: '/onboarding/character',
  ONBOARDING_SURVEY: '/onboarding/survey',
} as const;

export const APP_ROUTES = {
  MAIN: '/app',
  PLAN: '/app/plan',
  SETTINGS_NOTIFICATIONS: '/app/settings/notifications',
  SURVEY_EDIT: '/app/survey/edit',
} as const;

export const ROUTES = {
  ...PUBLIC_ROUTES,
  ...APP_ROUTES,
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

export const ROUTE_GROUPS = {
  PUBLIC: Object.values(PUBLIC_ROUTES),
  APP: Object.values(APP_ROUTES),
  ONBOARDING: [PUBLIC_ROUTES.ONBOARDING_CHARACTER, PUBLIC_ROUTES.ONBOARDING_SURVEY],
  LEGAL: [PUBLIC_ROUTES.LEGAL_TERMS],
  GUIDE: [PUBLIC_ROUTES.GUIDE_INSTALL],
  SETTINGS: [APP_ROUTES.SETTINGS_NOTIFICATIONS],
} as const;
