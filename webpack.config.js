const path = require("path");

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: [
    "./src/index.js",
    "./src/announcement.js",
    "./src/council.js",
    "./src/faculty.js",
    "./src/nap.js",
    "./src/security.js",
    "./src/userLogs.js",
    "./src/visitorLogs.js",
    "./src/vehicle.js",
    "./src/displayActivityLogs.js",
    "./src/adminLogin.js",
    "./src/archives.js",
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
