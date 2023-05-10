export async function withLoading(
  callback: () => boolean | Promise<boolean>,
  toggleLoading: () => void,
  options?: Partial<{ hasEndToggle: boolean }>
) {
  toggleLoading();
  if (!(await callback())) {
    toggleLoading();
    return;
  }
  if (options?.hasEndToggle) toggleLoading();
}
