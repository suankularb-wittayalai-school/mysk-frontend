/** @param {string} lang */
const formatters = (lang) => ({
  number: new Intl.NumberFormat(lang),
  and: new Intl.ListFormat(lang, { type: "conjunction" }),
  or: new Intl.ListFormat(lang, { type: "disjunction" }),
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
    // Search
    "/search/[view]": [
      "search/landing",
      "search/students/form",
      "search/teachers/form",
      "search/documents/form",
    ],
    "rgx:/search/\\w+/results$": ["search/common"],
    // Search Students
    "/search/students/results": ["search/students/list"],
    "rgx:/(search/students/results|(teach|manage)/electives|classes)$": [
      "search/students/header",
      "search/students/detail",
      "search/students/absenceHistoryDialog",
    ],
    // Search Teachers
    "/search/teachers/results": ["search/teachers/list"],
    "rgx:/(search/teachers/results|learn|teach)$": [
      "search/teachers/header",
      "search/teachers/detail",
    ],
    // Search Documents
    "/search/documents/results": [
      "search/documents/list",
      "search/documents/header",
      "search/documents/detail",
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
