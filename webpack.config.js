const path = require("path");

module.exports = {
    entry: "./src/main.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "shopeelize.js",
        libraryTarget: "umd",
        library: "shopeelize",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: path.resolve(__dirname, "node_modules"),
                include: path.resolve(__dirname, "src"),
            },
        ],
    },
};
