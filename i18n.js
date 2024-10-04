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
    "*": [
      "account/logOutDialog",
      "common",
      "common/appDrawer",
      "common/layout",
      "common/reportIssueDialog",
    ],
    // Home pages
    "rgx:/(learn|teach)$": [
      "home/glance/schedule",
      "home/glance/scheduleInaccurate",
      "home/subjectList",
    ],
    "/teach": ["home/classroomSubjectDialog", "home/subjectClassesDialog"],
    // Schedule
    "rgx:/(learn|teach|(teach|manage)/electives|classes|search/(students|teachers)/results|admin/schedule)$":
      ["schedule/common", "schedule/periodDialog"],
    // Schedule editor
    "rgx:/(teach|admin/schedule)$": [
      "schedule/editor/editDialog",
      "schedule/editor/hoverMenu",
    ],
    // Classes
    "/classes": ["classes/list", "classes/header", "classes/detail"],
    "rgx:/((classes/\\[classNumber\\]|manage/(classrooms|electives))/print)$": [
      "classes/print",
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
    "rgx:/(search/students/results|(teach|manage)/electives|classes(/\\[classNumber\\]/attendance/date/\\[date\\])?)$":
      [
        "search/students/header",
        "search/students/detail",
        "search/students/absenceHistoryDialog",
      ],
    // Search Teachers
    "/search/teachers/results": ["search/teachers/list"],
    "rgx:/(search/teachers/results|learn|teach|(teach|manage)/electives|classes)$":
      ["search/teachers/header", "search/teachers/detail"],
    // Search Documents
    "/search/documents/results": [
      "search/documents/list",
      "search/documents/header",
      "search/documents/detail",
    ],
    // Account
    "rgx:/account(/(about|contacts|certificates))?$": ["account/common"],
    "/account/about": [
      "account/about",
      "account/about/idCardDialog",
      "account/about/nameChangeDialog",
    ],
    "rgx:/(account/contacts|classes)$": [
      "account/contacts",
      "account/contacts/contactDialog",
    ],
    "/account/certificates": [
      "account/certificates",
      "account/certificates/receivingOrderDialog",
      "account/certificates/seatDialog",
    ],
    "/account/logout": ["account/logOut"],
  },
  logBuild: false,
  interpolation: {
    format: (value, format, lang) =>
      formatters(lang)[format]?.format(value) || value,
  },
  loadLocaleFrom: async (language, namespace) =>
    (await import(`./translations/${namespace}/${language}`)).default,
};
