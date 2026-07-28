/**
 * Shared validation rules for the JWT signing secret, used by both the module that signs
 * tokens and the strategy that verifies them so the two can never drift apart.
 */
export const AUTH_SECRET_OPTIONS = {
  minLength: 32,
  hint: 'Generate one with `openssl rand -base64 48`.',
}
