// Modules
import Image from "next/image";

interface ProfilePictureProps {
  src?: string;
  appearance?: "primary" | "secondary" | "tertiary";
}

const ProfilePicture = ({
  src,
  appearance,
}: ProfilePictureProps): JSX.Element => {
  return (
    <div className="container-tertiary relative h-full w-full">
      {src ? (
        <Image src={src} layout="fill" alt="" />
      ) : (
        <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            d="M81.7121 57.2458C81.7121 67.0279 73.7821 74.9579 64 74.9579C54.2178 74.9579 46.2879 67.0279 46.2879 57.2458C46.2879
              47.4637 54.2178 39.5337 64 39.5337C73.7821 39.5337 81.7121 47.4637 81.7121 57.2458ZM75.8081 57.2458C75.8081 63.7672
              70.5214 69.0539 64 69.0539C57.4786 69.0539 52.1919 63.7672 52.1919 57.2458C52.1919 50.7244 57.4786 45.4377
              64 45.4377C70.5214 45.4377 75.8081 50.7244 75.8081 57.2458Z"
            fill="currentColor"
          />
          <path
            d="M64 83.814C44.8875 83.814 28.6031 95.1155 22.4 110.949C23.9111 112.45 25.503 113.869 27.1685 115.2C31.7876 100.663
              46.2782 89.718 64 89.718C81.7218 89.718 96.2124 100.663 100.832 115.2C102.497 113.869 104.089 112.45 105.6
              110.949C99.3969 95.1155 83.1125 83.814 64 83.814Z"
            fill="currentColor"
          />
        </svg>
      )}
    </div>
  );
};

export default ProfilePicture;
