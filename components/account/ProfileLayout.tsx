import ProfileNavigation from "@/components/account/ProfileNavigation";
import PageHeader from "@/components/common/PageHeader";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { ContentLayout } from "@suankularb-components/react";
import useTranslation from "next-translate/useTranslation";
import { ReactNode } from "react";

/**
 * The layout for Profile pages.
 *
 * @param children The content of the page.
 * @param title The title of the page for mobile.
 */
const ProfileLayout: StylableFC<{
  children: ReactNode;
  title?: string;
}> = ({ children, title, style, className }) => {
  const { t } = useTranslation("account/common");

  return (
    <>
      <PageHeader
        parentURL="/account"
        className="[&>*>:first-child]:sm:!hidden"
      >
        {title && <span className="sm:hidden">{title}</span>}
        <span className={title ? "hidden sm:block" : undefined}>
          {t("title")}
        </span>
      </PageHeader>
      <ContentLayout>
        <div className="!-mb-9 contents sm:grid sm:grid-cols-[1fr,3fr] sm:gap-6">
          <section className="hidden sm:block">
            <ProfileNavigation />
          </section>
          <section
            style={style}
            className={cn(
              `relative *:mx-4 sm:h-[calc(100dvh-5.75rem)]`,
              className,
            )}
          >
            {children}
          </section>
        </div>
        <style jsx global>{`
          @media only screen and (min-width: 600px) {
            body {
              height: 100dvh;
            }
          }
        `}</style>
      </ContentLayout>
    </>
  );
};

export default ProfileLayout;
