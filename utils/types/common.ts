// External libraries
import { NextPage } from "next";
import { AppProps } from "next/app";

import { FC, ReactNode } from "react";

import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";

import { ColumnDef } from "@tanstack/react-table";

// Internal components
import { PageHeaderProps, TextFieldProps } from "@suankularb-components/react";

// Types
import { Role } from "@/utils/types/person";
import { Database } from "@/utils/types/supabase";

export type OrUndefined<T> = T | undefined;

/**
 * The language code of a supported UI language.
 */
export type LangCode = "en-US" | "th";

/**
 * The {@link NextPage} type extended with properties for SKCom.
 */
export type CustomPage<T = {}> = NextPage<T> &
  Partial<{
    /**
     * A wrapper for the entire app, commonly used for Contexts.
     */
    context: FC<{ children: ReactNode }>;

    /**
     * A FAB to place in Navigation Rail for or fixed on this page only.
     *
     * @see {@link https://docs.google.com/document/d/1UJeTpXcB2MBL9Df4GUUeZ78xb-RshNIC_-LCIKmCo-8/edit?usp=sharing#heading=h.v2ft1p7l7f8a SKCom documentation on FAB}
     */
    fab: JSX.Element;

    /**
     * Additional props for the Page Header component, applied specifically to
     * this page only.
     *
     * `title` is required.
     *
     * @see {@link https://docs.google.com/document/d/1UJeTpXcB2MBL9Df4GUUeZ78xb-RshNIC_-LCIKmCo-8/edit?usp=sharing#heading=h.5w06ou3fwzsd SKCom documentation on Page Header}
     */
    pageHeader: {
      /**
       * The title text: the biggest text in a page and the only within a `<h1>`
       * tag.
       *
       * - You can use next-i18next by passing in the key and the namespace in an
       *   object, i.e. `{ key: "title", ns: "home" }`
       * - Always required.
       */
      title: string | JSX.Element | { key: string; ns: string };
    } & Partial<Omit<PageHeaderProps, "title">>;

    /**
     * Who can access this page.
     */
    pageRole: Role | "public";

    /**
     * A list of child URLs of the current page.
     */
    childURLs: string[];
  }>;

/**
 * The {@link AppProps} type extended with properties for SKCom.
 */
export type CustomAppProps = {
  Component: CustomPage;
  pageProps: AppProps["pageProps"];
};

export type MultiLangString = {
  th: string;
  "en-US"?: string;
};

export type MultiLangObj<T = object> = {
  th: T;
  "en-US"?: T;
};

export type DialogProps = {
  open: boolean;
  onClose: () => void;
};

export type SubmittableDialogProps<T = () => void> = DialogProps & {
  onSubmit: T;
};

export type BackendReturn = { error: Partial<PostgrestError> | null };

export type BackendDataReturn<T, U = []> =
  | { data: T; error: null }
  | { data: U; error: Partial<PostgrestError> };

export type DatabaseClient = SupabaseClient<
  Database,
  "public",
  Database["public"]
>;

export type DataTableColumnDef = ColumnDef<object> &
  Partial<{
    thClass: string;
    tdClass: string;
    render: (row: any) => JSX.Element;
    noDataMsg: string | JSX.Element;
  }>;

export type DialogComponent<T = {}> = FC<T & DialogProps>;
export type SubmittableDialogComponent<T = () => void, U = {}> = FC<
  U & SubmittableDialogProps<T>
>;

export type FormControlValues<T extends string | symbol = string> = {
  [key in T]: string;
};
export type FormControlValids<T extends string | symbol = string> = {
  [key in T]: boolean;
};
export type FormControlValidsWMessages<T extends string | symbol = string> = {
  [key in T]: boolean | string;
};
export type FormControlProps<T extends string | symbol = string> = {
  [key in T]: Pick<
    TextFieldProps,
    "helperMsg" | "value" | "onChange" | "required" | "error"
  >;
};
