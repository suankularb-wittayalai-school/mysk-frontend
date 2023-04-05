// External libraries
import Image from "next/image";

// Images
import NotFoundImage from "@/public/images/graphics/error/404.png";

// Internal components
import ErrorHero from "@/components/error/ErrorHero";
import ErrorLayout from "@/components/error/ErrorLayout";

// Types
import { CustomPage } from "@/utils/types/common";

const NotFoundPage: CustomPage = () => {
  return (
    <ErrorLayout>
      <ErrorHero
        image={<Image src={NotFoundImage} width={360} height={306} alt="" />}
        title="We couldn’t find that."
        code={404}
        verbose="Not Found"
      >
        <p className="skc-body-large">Check the URL and try again.</p>
      </ErrorHero>
    </ErrorLayout>
  );
};

export default NotFoundPage;
