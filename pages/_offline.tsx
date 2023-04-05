// External libraries
import Image from "next/image";

// Images
import OfflineImage from "@/public/images/graphics/error/offline.png";

// Internal components
import ErrorHero from "@/components/error/ErrorHero";
import ErrorLayout from "@/components/error/ErrorLayout";

// Types
import { CustomPage } from "@/utils/types/common";

const OfflinePage: CustomPage = () => {
  return (
    <ErrorLayout>
      <ErrorHero
        image={<Image src={OfflineImage} width={360} height={306} alt="" />}
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
