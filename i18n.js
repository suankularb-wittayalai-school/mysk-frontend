/** @param {string} lang */
const formatters = (lang) => ({
  number: new Intl.NumberFormat(lang),
  day: new Intl.DateTimeFormat(lang, { weekday: "long" }),
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
    // Common
    "*": ["common", "common/appDrawer", "common/layout"],
    // Home pages
    "rgx:/(learn|teach)$": [
      "home/glance/schedule",
      "home/glance/scheduleInaccurate",
      "home/subjectList",
    ],
    "/teach": ["home/classroomSubjectDialog", "home/subjectClassesDialog"],
    // Schedule
    "rgx:/(learn|teach|classes|search/(students|teachers)/results|admin/schedule)$":
      ["schedule/common", "schedule/periodDialog"],
    // Schedule editor
    "rgx:/(teach|admin/schedule)$": [
      "schedule/editor/editDialog",
      "schedule/editor/hoverMenu",
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
