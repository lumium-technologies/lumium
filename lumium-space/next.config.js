const webpack = require('webpack');
var dotenvExpand = require('dotenv-expand')

var dotenv_path;

if (process.env.REVIEW_APP && process.env.NODE_ENV === 'production') {
    dotenv_path = process.cwd() + '/.env.review';
} else if (process.env.NODE_TEST) {
    dotenv_path = process.cwd() + '/.env.test';
} else if (process.env.NODE_ENV !== 'production') {
    dotenv_path = process.cwd() + '/.env.development';
}

const { parsed: myEnv } = dotenvExpand.expand(require('dotenv').config({
    path: dotenv_path
}));

// This entire configuration file using WasmChunksFixPlugin is because of https://github.com/vercel/next.js/issues/29362
module.exports = {
    webpack(config) {
        if (dotenv_path) {
            config.plugins.push(new webpack.EnvironmentPlugin(myEnv));
        }
        config.experiments = {
            asyncWebAssembly: true,
            layers: true,
        };

        return config;
    },
};
