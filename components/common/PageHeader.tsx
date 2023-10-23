// Imports
import AppDrawer from "@/components/common/AppDrawer";
import AppStateContext from "@/contexts/AppStateContext";
import useLocale from "@/utils/helpers/useLocale";
import {
  PageHeader as BasePageHeader,
  PageHeaderProps,
} from "@suankularb-components/react";
import Link from "next/link";
import { FC, useContext } from "react";

/**
 * There’s exactly one Page Header on every page. It displays the title (in
 * the only `<h1>` on the page), the back Button for navigating up, and
 * the App Drawer.
 *
 * @see {@link BasePageHeader Page Header}
 *
 * @returns A Page Header.
 */
const PageHeader: FC<
  Pick<PageHeaderProps, "children"> & Partial<PageHeaderProps>
> = (props) => {
  const locale = useLocale();
  const { setNavOpen } = useContext(AppStateContext);

  return (
    <BasePageHeader
      appDrawer={<AppDrawer />}
      locale={locale}
      buttonElement={Link}
      onNavToggle={() => setNavOpen(true)}
      {...props}
    />
  );
};

export default PageHeader;
