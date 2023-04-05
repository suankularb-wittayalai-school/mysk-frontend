// Images
import ServerErrorLight from "@/public/images/graphics/error/500-light.png";
import ServerErrorDark from "@/public/images/graphics/error/500-dark.png";

// Internal components
import MultiSchemeImage from "@/components/common/MultiSchemeImage";
import ErrorHero from "@/components/error/ErrorHero";
import ErrorLayout from "@/components/error/ErrorLayout";

// Types
import { CustomPage } from "@/utils/types/common";

const ServerErrorPage: CustomPage = () => {
  return (
    <ErrorLayout>
      <ErrorHero
        image={
          <MultiSchemeImage
            srcLight={ServerErrorLight}
            srcDark={ServerErrorDark}
            width={360}
            height={244}
            alt=""
          />
        }
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
