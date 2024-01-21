import ProfileNavigation from "@/components/account/ProfileNavigation";
import PageHeader from "@/components/common/PageHeader";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { UserRole } from "@/utils/types/person";
import { ContentLayout } from "@suankularb-components/react";
import { useTranslation } from "next-i18next";
import { ReactNode } from "react";

/**
 * The layout for Profile pages.
 * 
 * @param children The content of the page.
 * @param role The role of the currently logged in user.
 */
const ProfileLayout: StylableFC<{
  children: ReactNode;
  role: UserRole;
}> = ({ children, role, style, className }) => {
  const { t } = useTranslation("account");

  return (
    <>
      <PageHeader parentURL="/account">{t("title")}</PageHeader>
      <ContentLayout>
        <div className="!-mb-9 contents sm:grid sm:grid-cols-[1fr,3fr] sm:gap-6">
          <section className="hidden sm:block">
            <ProfileNavigation role={role} />
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
