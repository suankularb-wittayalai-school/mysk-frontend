const path = require("path");

module.exports = {
  i18n: {
    defaultLocale: "th",
    locales: ["th", "en-US"],
    localePath: path.resolve("./public/static/locales"),
  },
};
