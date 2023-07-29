// Imports
import { useOneTapSignin } from "@/utils/helpers/auth";

/**
 * Google’s One Tap Sign in.
 * 
 * @returns A hidden `<div>`.
 */
const GoogleOneTap = () => {
  useOneTapSignin({ redirect: false, parentContainerId: "one-tap" });

  return (
    <div id="one-tap" className="fixed right-0 top-0 [color-scheme:light]" />
  );
};

export default GoogleOneTap;
