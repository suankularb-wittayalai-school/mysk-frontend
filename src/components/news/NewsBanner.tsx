import Image from "next/image";
import { useRouter } from "next/router";

const NewsBanner = ({
  content,
  banner,
}: {
  content: {
    title: { "en-US"?: string; th: string };
    subtitle?: { "en-US"?: string; th: string };
  };
  banner?: string;
}): JSX.Element => {
  const locale = useRouter().locale as "en-US" | "th";

  return (
    <section className="flex flex-col gap-6">
      {banner && (
        <div>
          <div className="relative aspect-[2/1] w-full overflow-hidden rounded-2xl bg-surface-variant shadow sm:aspect-[5/1]">
            <Image alt="" layout="fill" objectFit="cover" src={banner} />
          </div>
        </div>
      )}
      <div className="font-display">
        <h2 className="text-3xl font-bold">{content.title[locale]}</h2>
        {content.subtitle && (
          <p className="text-xl">{content.subtitle[locale]}</p>
        )}
      </div>
    </section>
  );
};

export default NewsBanner;
