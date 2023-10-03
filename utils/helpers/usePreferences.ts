// Imports
import { useEffect, useState } from "react";
import useLocale from "@/utils/helpers/useLocale";
import { ColorScheme, Preferences } from "@/utils/types/common";

/**
 * Get and set user preferences in local storage.
 *
 * @returns
 * `preferences` — live user preferences from local storage;
 * `setPreference` — set the value of a specific preferences key.
 */
export default function usePreferences() {
  const locale = useLocale();

  const [preferences, setPreferences] = useState<Preferences | null>(null);

  useEffect(() => {
    if (preferences !== null) return;

    // Clear legacy references
    // TODO: Remove this after we reckon most people no longer have this key
    localStorage.removeItem("preferredLang");

    // Attempt to get preferences from local storage
    const userPrefs = localStorage.getItem("preferences");
    if (userPrefs) {
      setPreferences(JSON.parse(userPrefs));
      return;
    }

    // Generate a preferences object if it doesn’t exist
    const defaultPrefs = { locale, colorScheme: "auto" as ColorScheme };
    localStorage.setItem("preferences", JSON.stringify(defaultPrefs));
    setPreferences(defaultPrefs);
  }, [preferences]);

  function setPreference(
    key: keyof Preferences,
    value: Preferences[keyof Preferences]
  ) {
    localStorage.setItem(
      "preferences",
      JSON.stringify({ ...preferences, [key]: value })
    );
    setPreferences(null);
  }

  return {
    /** Live user preferences from local storage. */
    preferences,

    /**
     * Set the value of a specific preferences key.
     *
     * @param key The identifying key of the preference to set.
     * @param value The value to set that key to.
     */
    setPreference,
  };
}
