// This file is a workaround for the fact that ReSKCom does not export types

export type BannerAction = {
  label: string;
  disabled?: boolean | undefined;
  isDangerous?: boolean | undefined;
} & ({ type: "button"; onClick: () => void } | { type: "link"; url: string });

export type WaitingNoticebar = {
  id: string;
  type: "info" | "notice" | "warning";
  icon?: JSX.Element;
  title?: string;
  message: string | JSX.Element;
  actions: [] | [BannerAction] | [BannerAction, BannerAction];
};
