// External libraries
import Image from "next/image";

// Images
import ServerErrorImage from "@/public/images/graphics/error/500.png";

// Internal components
import ErrorHero from "@/components/error/ErrorHero";
import ErrorLayout from "@/components/error/ErrorLayout";

// Types
import { CustomPage } from "@/utils/types/common";

const ServerErrorPage: CustomPage = () => {
  return (
    <ErrorLayout>
      <ErrorHero
        image={<Image src={ServerErrorImage} width={360} height={306} alt="" />}
        title="Something went wrong on the server."
        code={500}
        verbose="Internal Server Error"
      >
        <div className="skc-body-large flex flex-col gap-2">
          <p>
            We encountered an error on the server. Try again in a few moments.
          </p>
          <p>If this persists, contact support.</p>
        </div>
      </ErrorHero>
    </ErrorLayout>
  );
};

export default ServerErrorPage;
