"use strict";

module.exports = {
    entry: "./src/index.ts",
    devtool: "inline-source-map",
    output: {
        filename: "./scripts/main.js"
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