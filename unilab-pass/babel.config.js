module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    env: {
      production: {
        plugins: ["react-native-paper/babel"],
      },
    },
    plugins: [
      "react-native-worklets-core/plugin",
      "react-native-reanimated/plugin",
    ],
  };
};
