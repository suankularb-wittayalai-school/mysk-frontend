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
     * Determines what links are shown in Navigation Bar/Rail/Drawer
     *
     * ---
     *
     * An example of the effects of each type in a Navigation Bar/Rail:
     *
     * `student` — Learn, Class, Lookup, News, Account;
     *
     * `teacher` — Teach, (Class), Lookup, News, Account;
     *
     * `hidden` — Navigation Bar/Rail not shown at all.
     */
    navType: Role | "hidden";

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
  [key in T]: any;
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
