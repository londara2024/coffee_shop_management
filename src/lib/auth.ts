export const AUTH_COOKIE = "aura-auth"

/** No real backend yet — sign-in/sign-up just drop a cookie so middleware can gate the home page. */
export function markSignedIn() {
  document.cookie = `${AUTH_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 365}`
}
