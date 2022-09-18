const path = require("path");

module.exports = {
  i18n: {
    localeDetection: false,
    defaultLocale: "th",
    locales: ["th", "en-US"],
    localePath: path.resolve("./public/static/locales"),
  },
};
