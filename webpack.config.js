const path = require("path");

module.exports = {
  mode: "development",
  entry: [
    "./src/index.js",
    "./dist/script.js"
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
