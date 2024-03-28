/**
 * Toggles loading state before and after the callback.
 *
 * @param callback The function to run. Returns true if sucessful, false otherwise.
 * @param toggleLoading The function to toggle loading state.
 * @param options Options.
 * @param options.hasEndToggle Whether to toggle loading state after the callback ended successfully. Default is false.
 */
export default async function withLoading(
  callback: () => boolean | Promise<boolean>,
  toggleLoading: () => void,
  options?: Partial<{ hasEndToggle: boolean }>,
) {
  toggleLoading();
  if (!(await callback())) {
    toggleLoading();
    return;
  }
  if (options?.hasEndToggle) toggleLoading();
}
