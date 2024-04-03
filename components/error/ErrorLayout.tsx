import PageHeader from "@/components/common/PageHeader";
import LandingBlobs from "@/components/landing/LandingBlobs";
import cn from "@/utils/helpers/cn";
import { StylableFC } from "@/utils/types/common";
import { ReactNode } from "react";

/**
 * A layout for error pages. Contains a blank Page Header and a container for
 * the error message.
 *
 * @param children The error message.
 */
const ErrorLayout: StylableFC<{
  children: ReactNode;
}> = ({ children, style, className }) => (
  <div
    style={style}
    className={cn(
      `flex min-h-[calc(100dvh-5rem)] flex-col sm:min-h-dvh sm:px-0`,
      className,
    )}
  >
    <div
      className={cn(`fixed inset-0 -z-10 overflow-hidden sm:bottom-auto
        sm:h-screen`)}
    >
      <LandingBlobs className="md:[&>:nth-child(2)]:hidden" />
    </div>

    <PageHeader onBack={() => window.history.back()} buttonElement="button">
      {null}
    </PageHeader>

    <div
      className={cn(`mx-4 flex max-w-[46.5rem] grow flex-col justify-center
        gap-6 pb-32 sm:mx-auto sm:pt-20`)}
    >
      {children}
    </div>

    {/* Hide default Page Header blobs */}
    <style jsx global>{`
      .skc-page-header__blobs:has(~ .skc-page-header) {
        display: none;
      }
    `}</style>
  </div>
);

export default ErrorLayout;
