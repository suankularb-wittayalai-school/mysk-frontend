// External libraries
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GoogleForm, googleFormsToJson } from "react-google-forms-hooks";
import { useEffect, useState } from "react";

const FormPage: NextPage = () => {
    const { t } = useTranslation(["class", "common"]);
    const locale = useRouter().locale == "th" ? "th" : "en-US";

    return <div>FormPage</div>;
}


export const getServerSideProps: GetServerSideProps = async ({
    locale,
    params,
  }) => ({
    props: {
      ...(await serverSideTranslations(locale as string, [
        "common"
      ])),
    },
  });
  
  export default FormPage;