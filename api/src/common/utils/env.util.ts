/**
 * Reads a required environment variable.
 *
 * Deliberately throws instead of falling back to a literal default: a hardcoded credential
 * is readable by anyone with repository access, and a silent fallback hides a misconfigured
 * deployment until something worse happens.
 */
export function requireEnv(name: string, options: RequireEnvOptions = {}): string {
  const value = process.env[name]?.trim()
  const hint = options.hint ? ` ${options.hint}` : ''

  if (!value) {
    throw new Error(`${name} is not set. Add it to api/.env and to the deployment environment.${hint}`)
  }

  if (options.minLength && value.length < options.minLength) {
    throw new Error(`${name} must be at least ${options.minLength} characters long.${hint}`)
  }

  return value
}

type RequireEnvOptions = {
  minLength?: number
  hint?: string
}
