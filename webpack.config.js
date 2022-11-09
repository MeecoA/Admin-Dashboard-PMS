const path = require("path");

module.exports = {
  mode: "development",
  entry: [
    "./src/index.js",
    "./src/announcement.js",
    "./src/council.js",
    "./src/faculty.js",
    "./src/nap.js",
    "./src/security.js",
    "./src/userLogs.js",
    "./src/visitorLogs.js",
  ],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  watch: true,
  experiments: {
    topLevelAwait: true,
  },
};
