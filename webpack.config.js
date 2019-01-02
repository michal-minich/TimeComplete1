"use strict";

module.exports = {
    entry: "./src/start.ts",
    devtool: false/*"inline-source-map"*/,
    output: {
        filename: "../wwwroot/scripts/main.js"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "surplus-loader!ts-loader",
                exclude: /node_modules/
            }
        ]
    }
};