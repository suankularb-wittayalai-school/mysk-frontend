// Imports
import { TextFieldProps } from "@suankularb-components/react";
import { NextPage } from "next";
import { AppProps } from "next/app";
import { CSSProperties, FC, ReactNode } from "react";

/**
 * The language code of a supported UI language.
 */
export type LangCode = "en-US" | "th";

/**
 * The color scheme of the UI: light, dark, or auto.
 */
export type ColorScheme = "light" | "dark" | "auto";

/**
 * User preferences parsed from local storage.
 */
export type Preferences = { locale: LangCode; colorScheme: ColorScheme };

/**
 * A function component stylable through `className` and `style`.
 */
export type StylableFC<Props extends {} = {}> = FC<
  Props & { className?: string; style?: CSSProperties }
>;

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
    navType: "student" | "teacher" | "hidden";

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

/**
 * Values of a form.
 */
export type FormControlValues<T extends string | symbol = string> = {
  [key in T]: any;
};

/**
 * The validity of each value in a form, represented as booleans.
 */
export type FormControlValids<T extends string | symbol = string> = {
  [key in T]: boolean;
};

/**
 * The validity of each value in a form, represented as booleans or error
 * messages.
 */
export type FormControlValidsWMessages<T extends string | symbol = string> = {
  [key in T]: boolean | string;
};

/**
 * Props of each value in a form, can be applied directly on Text Field.
 */
export type FormControlProps<T extends string | symbol = string> = {
  [key in T]: Pick<
    TextFieldProps<string | File>,
    "helperMsg" | "value" | "onChange" | "required" | "error"
  >;
};

/**
 * A string that supports Thai and English, with the latter being optional.
 */
export type MultiLangString = {
  th: string;
  "en-US": string | null;
};
