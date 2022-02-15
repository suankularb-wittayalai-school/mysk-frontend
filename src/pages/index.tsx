// Modules
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";

// SK Components
import { LinkButton, MaterialIcon } from "@suankularb-components/react";

// Types
import { LandingFeedItem as LandingFeedItemType } from "src/utils/types/landing";

const LandingHeader = (): JSX.Element => (
  <header
    className="min-h-screen snap-start bg-[url('/images/landing.png')]
      bg-cover bg-left font-display sm:min-h-[calc(100vh-12rem)]"
  >
    <div
      className="flex h-full flex-col items-center gap-16 bg-gradient-to-b from-[#00000033] via-transparent to-[#00000033]
        px-8 py-16 sm:items-start sm:bg-gradient-to-r sm:px-16"
    >
      <div className="flex flex-col items-center text-center sm:flex-row sm:gap-8 sm:text-left">
        <div className="relative h-40 w-40">
          <Image
            src={"/images/branding/logo-white.png"}
            layout="fill"
            priority={true}
          />
        </div>
        <div className="font-display text-light-white">
          <h1 className="text-9xl font-bold">
            My<span className="text-light-secondary-container">SK</span>
          </h1>
          <p className="text-4xl font-light">โรงเรียนสวนกุหลาบวิทยาลัย</p>
        </div>
      </div>
      <div className="flex flex-row flex-wrap justify-center gap-4">
        <LinkButton
          name="เข้าสู่ระบบ"
          type="filled"
          icon={<MaterialIcon icon="login" />}
          url="/account/login"
          LinkElement={Link}
          className="!bg-light-tertiary-container !text-light-on-tertiary-container focus:shadow-lg"
        />
        <LinkButton
          name="ช่วยเหลือ"
          type="outlined"
          url="/help"
          LinkElement={Link}
          className="!border-light-tertiary-container !bg-transparent !text-light-tertiary-container
            hover:!bg-light-tertiary-translucent-08 focus:!bg-light-tertiary-translucent-12
            focus-visible:!bg-light-tertiary"
        />
      </div>
    </div>
  </header>
);

const LandingFeedItem = ({ feedItem }: { feedItem: LandingFeedItemType }) => (
  <li key={feedItem.id}>
    <Link href={feedItem.url}>
      <a className="group flex flex-col gap-3 rounded-8xl">
        <div
          className="relative grid aspect-[3/2] w-full place-items-center rounded-8xl bg-light-surface-variant bg-cover
            bg-center text-center font-display
            transition-shadow group-hover:shadow group-focus:shadow-md"
          style={{ backgroundImage: `url('${feedItem.image}')` }}
        >
          {!feedItem.image && feedItem.name}
        </div>
        <div>
          <h3 className="font-display text-4xl font-bold">{feedItem.name}</h3>
          <p className="max-lines-2 font-display text-xl">{feedItem.desc}</p>
        </div>
      </a>
    </Link>
  </li>
);

const LandingFeed = ({
  feed,
}: {
  feed: Array<LandingFeedItemType>;
}): JSX.Element => {
  return (
    <section className="min-h-screen snap-start pb-20">
      <ul className="flex flex-col gap-8 p-8 sm:grid sm:grid-cols-[repeat(auto-fill,minmax(22.5rem,1fr))]">
        {feed.map((feedItem) => (
          <LandingFeedItem feedItem={feedItem} />
        ))}
      </ul>
    </section>
  );
};

const Landing: NextPage = () => {
  return (
    <div className="flex snap-y flex-col">
      <LandingHeader />
      <LandingFeed
        feed={[
          {
            id: 0,
            name: "ประกาศเกียรติคุณ",
            desc: "ประกาศเกียรติคุณโรงเรียนสวนกุหลาบวิทยาลัย ประจำปีการศึกษา 2563",
            url: "/certificate?year=2563",
          },
          {
            id: 1,
            name: "การบริหารจัดการชั้นเรียน",
            desc: "เรื่องที่พวกเราจะเล่านั้น เป็นเพียงประเด็นเล็กๆ ที่ใช้บริหารจัดการชั้นเรียนได้อยู่หมัด มันดึงความสนใจของเด็กน้อยจากมือถือได้ \
              แถมมีเสียงหัวเราะเกิดขึ้นในชั้นเรียน นักเรียนได้ค้นคว้าได้ทดลอง ได้ฝึกปฏิบัติ กิจกรรมเหล่านี้ส่งเสริมให้นักเรียนเกิดทักษะการคิดและ แลกเปลี่ยนเรียนรู้ร่วมกัน \
              ทำให้นักเรียนมีความสุขสนุกสนานในการเรียนและเกิดทักษะการรวบรวมข้อมูล คิดอย่างเป็นระบบสร้างเป็นองค์ความรู้ที่ยั่งยืนได้อย่างแท้จริง",
            url: "/online/teacher-videos",
          },
        ]}
      />
    </div>
  );
};

export default Landing;
