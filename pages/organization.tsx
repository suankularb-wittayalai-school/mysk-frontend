import useMySKClient from "@/utils/backend/mysk/useMySKClient";
import { CustomPage } from "@/utils/types/common";
import { useRouter } from "next/router";
import { useEffect } from "react";

const OrganizationPage: CustomPage = () => {
  const mysk = useMySKClient();
  const router = useRouter();
  useEffect(() => {
    if (mysk.user?.email == "kornor@sk.ac.th") router.push("/club");
  }, []);
};

export default OrganizationPage;
