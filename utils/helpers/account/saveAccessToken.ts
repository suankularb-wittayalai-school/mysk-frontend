import { OAuthResponseData } from "@/utils/types/fetch";

/**
 * Saves the access token to the browser cookies.
 *
 * @param oAuthResponse The OAuth response data from `/auth/oauth/google`.
 */
export default function saveAccessToken(oAuthResponse: OAuthResponseData) {
  const { access_token, expires_in } = oAuthResponse;
  const expiryDate = new Date(Date.now() + expires_in * 1000).toUTCString();
  document.cookie = `access_token=${access_token}; expires=${expiryDate}; path=/`;
}
