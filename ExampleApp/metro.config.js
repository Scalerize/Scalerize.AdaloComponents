const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

const contextMenuPath = path.resolve(__dirname, '../ContextMenu');

const config = {
    resolver: {
      nodeModulesPaths: [
        path.resolve(__dirname, 'node_modules'),
        contextMenuPath,
      ],
      resolveRequest: (context, moduleName, platform) => {
        if (moduleName === 'context-menu') {
          return {
            filePath: path.join(contextMenuPath, 'index'),
            type: 'sourceFile',
          };
        }
        return context.resolveRequest(context, moduleName, platform);
      },
    },
    watchFolders: [contextMenuPath]
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);