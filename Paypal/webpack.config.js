const {AdaloDefaultConfig} = require("@adalo/cli/src/webpackConfig");

const config = {
    ...AdaloDefaultConfig,
    resolve: {
        ...AdaloDefaultConfig?.resolve,
        alias: {
            'react-native': 'react-native-web',
            'react-native-webview': 'react-native-web-webview'
        }
    }
}

module.exports = config;
