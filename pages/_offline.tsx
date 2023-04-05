// Images
import OfflineLight from "@/public/images/graphics/error/offline-light.png";
import OfflineDark from "@/public/images/graphics/error/offline-dark.png";

// Internal components
import MultiSchemeImage from "@/components/common/MultiSchemeImage";
import ErrorHero from "@/components/error/ErrorHero";
import ErrorLayout from "@/components/error/ErrorLayout";

// Types
import { CustomPage } from "@/utils/types/common";

const OfflinePage: CustomPage = () => {
  return (
    <ErrorLayout>
      <ErrorHero
        image={
          <MultiSchemeImage
            srcLight={OfflineLight}
            srcDark={OfflineDark}
            width={360}
            height={244}
            alt=""
          />
        }
        title="Connect to the internet."
      >
        <p className="skc-body-large">
          When you’re offline, some pages may not be available. Check your
          internet connection and try again.
        </p>
      </ErrorHero>
    </ErrorLayout>
  );
};

export default OfflinePage;
