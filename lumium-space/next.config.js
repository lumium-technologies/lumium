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
    webpack(config, {isServer, dev}) {
        if (dotenv_path) {
            config.plugins.push(new webpack.EnvironmentPlugin(myEnv));
        }
        config.experiments = {
            asyncWebAssembly: true,
            layers: true,
        };
        if (!dev && isServer) {
            config.output.webassemblyModuleFilename = "chunks/[id].wasm";
            config.plugins.push(new WasmChunksFixPlugin());
        }

        return config;
    },
};

class WasmChunksFixPlugin {
    apply(compiler) {
        compiler.hooks.thisCompilation.tap("WasmChunksFixPlugin", (compilation) => {
            compilation.hooks.processAssets.tap(
                { name: "WasmChunksFixPlugin" },
                (assets) =>
                Object.entries(assets).forEach(([pathname, source]) => {
                    if (!pathname.match(/\.wasm$/)) return;
                    compilation.deleteAsset(pathname);

                    const name = pathname.split("/")[1];
                    const info = compilation.assetsInfo.get(pathname);
                    compilation.emitAsset(name, source, info);
                })
            );
        });
    }
}
