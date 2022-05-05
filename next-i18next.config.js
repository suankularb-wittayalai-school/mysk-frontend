const path = require("path");

module.exports = {
  i18n: {
    defaultLocale: "th",
    locales: ["en-US", "th"],
    localePath: path.resolve("./public/static/locales"),
  },
};
