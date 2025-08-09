/** @param {string} lang */
const formatters = (lang) => ({
  number: new Intl.NumberFormat(lang),
  percent: new Intl.NumberFormat(lang, { style: "percent" }),
  and: new Intl.ListFormat(lang, { type: "conjunction" }),
  or: new Intl.ListFormat(lang, { type: "disjunction" }),
  day: new Intl.DateTimeFormat(lang, { weekday: "long" }),
  date: new Intl.DateTimeFormat(lang, { dateStyle: "medium" }),
  dateonly: new Intl.DateTimeFormat(lang, { day: "numeric" }),
  dateshort: new Intl.DateTimeFormat(lang, {
    day: "numeric",
    month: "short",
  }),
  month: new Intl.DateTimeFormat(lang, { month: "long", year: "numeric" }),
  monthshort: new Intl.DateTimeFormat(lang, {
    month: "short",
    year: "numeric",
  }),
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
      "home/activityList",
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
    // Manage
    "/manage": [
      "manage",
      "manage/attendance",
      "manage/elective",
      "manage/classrooms",
      "manage/participation",
    ],
    "/manage/participation": ["manage/participation"],
    "rgx:/manage/attendance/\\[date\\]$": [
      "manage/attendance",
      "attendance/viewSelector/action",
      "attendance/viewSelector/dialog",
    ],
    "/manage/electives": [
      "elective/title",
      "elective/list",
      "elective/detail/information",
      "elective/detail/students",
    ],
    "/manage/electives/print": ["elective/print"],
    // Elective
    "rgx:/(teach|learn)/electives": [
      "elective/title",
      "elective/list",
      "elective/detail/information",
      "elective/detail/students",
      "elective/detail/empty",
    ],
    "/learn/electives": [
      "elective/dialog/createRequest",
      "elective/detail/trade",
      "elective/dialog/requirements",
    ],
    "/teach/electives/[id]/print": ["elective/print", "classes/print"],
    // Cheer
    "/cheer": ["attendance/cheer", "attendance/cheer/list"],
    "/cheer/attendance/[date]": [
      "attendance/cheer",
      "attendance/cheer/list",
      "elective/list",
      "search/common",
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
