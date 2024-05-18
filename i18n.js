/** @param {string} lang */
const formatters = (lang) => ({
  number: new Intl.NumberFormat(lang),
  date: new Intl.DateTimeFormat(lang, { dateStyle: "medium" }),
  time: new Intl.DateTimeFormat(lang, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }),
});

/** @type {import('next-translate').I18nConfig} */
module.exports = {
  defaultLocale: "th",
  locales: ["en-US", "th"],
  pages: {
    "*": ["common"],
    "/learn": [
      "glance/schedule",
      "glance/scheduleInaccurate",
      "schedule/common",
      "schedule/periodDialog",
      "schedule/subjectList",
    ],
    "/teach": [
      "glance/schedule",
      "glance/scheduleInaccurate",
      "schedule/common",
      "schedule/editor/editDialog",
      "schedule/editor/hoverMenu",
      "schedule/periodDialog",
      "schedule/subjectList",
    ],
  },
  logBuild: false,
  interpolation: {
    format: (value, format, lang) =>
      formatters(lang)[format]?.format(value) || value,
  },
  loadLocaleFrom: async (language, namespace) =>
    (await import(`./translations/${namespace}/${language}`)).default,
};
