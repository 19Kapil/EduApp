const { getDefaultConfig } = require("metro-config");

module.exports = {
  resolver: {
    extraNodeModules: {
      crypto: require.resolve("react-native-crypto"),
    },
  },
};
