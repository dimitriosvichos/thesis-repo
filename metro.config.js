const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Disable the realtime WebSocket functionality that requires Node.js stream
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'stream' || moduleName === 'ws') {
    return {
      type: 'empty',
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
