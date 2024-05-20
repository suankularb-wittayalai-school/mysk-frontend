import { LangCode } from "@/utils/types/common";
import { GsiButtonConfiguration } from "google-one-tap";

const DEFAULT_BUTTON_WIDTH = 281;

/**
 * Prompts the Google One Tap UI and renders the Google Sign In (GSI) Button.
 *
 * @param parentButtonId The HTML ID of the Sign in Button.
 * @param buttonWidth The width of the Sign in Button in CSS pixels.
 * @param locale The locale of the Sign in Button.
 * @param onClick Triggers *alongside* the sign in flow when the Sign in Button is clicked.
 * @param onClickFallback Triggers *instead of* the sign in flow when the Sign in Button is clicked. Only used when the domain is not eligible.
 */
export default async function renderGoogleUI(
  parentButtonID: string | undefined = undefined,
  buttonWidth: number = DEFAULT_BUTTON_WIDTH,
  locale: LangCode,
  onClick?: () => void,
  onClickFallback?: () => void,
) {
  const { google } = window;
  const onEligibleDomain = ["localhost:3000", "mysk.school"].includes(
    window.location.host,
  );

  // Prompt the Google One Tap UI.
  google.accounts.id.prompt();

  // Render the Google Sign In (GSI) Button if provided with an ID.
  const parentButton = parentButtonID
    ? document.getElementById(parentButtonID)
    : null;
  if (!parentButton) return;
  google.accounts.id.renderButton(
    parentButton,
    {
      theme: "outline",
      text: "signin_with",
      shape: "pill",
      width: buttonWidth || 281,
      locale,
      click_listener: onClick,
    } as GsiButtonConfiguration,
    !onEligibleDomain ? onClickFallback : undefined,
  );
}
