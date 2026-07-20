const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  "react-async-hook": path.resolve(__dirname, "node_modules/react-async-hook/dist/index.js"),
};

module.exports = config;
