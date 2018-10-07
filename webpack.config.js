"use strict";

module.exports = {
    entry: "./src/app.ts",
    devtool: "inline-source-map",
    output: {
        filename: "./main.js"
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