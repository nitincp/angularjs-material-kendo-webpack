const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

let cleanVendors = new CleanWebpackPlugin(['dist/vendors'], {})
let cleanApp = new CleanWebpackPlugin(['dist/app'], {})

//let isDev = process.env.NODE_ENV === "development";
// let extractSass = new ExtractTextPlugin({
//     filename: "[name].css",
//     disable: isDev
// });

let src_dir = path.resolve(__dirname, "src");
let dist_dir = path.resolve(__dirname, "dist");

let vendors_dist_dir = path.join(dist_dir, "vendors");
let app_dist_dir = path.join(dist_dir, "app");

module.exports = [
    {
        name: "vendors",
        entry: ["./src/vendors.ts"],
        module: {
            loaders: [ // loaders will work with webpack 1 or 2; but will be renamed "rules" in future
                // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
                { test: /\.tsx?$/, loader: 'ts-loader' },
                {
                    test: /\.scss$/,
                    use: [{
                        loader: "style-loader" // creates style nodes from JS strings
                    }, {
                        loader: "css-loader" // translates CSS into CommonJS
                    }, {
                        loader: "sass-loader" // compiles Sass to CSS
                    }]
                }
            ]
        },
        output: {
            path: vendors_dist_dir,
            filename: "vendors.js",
            library: "vendors"
        },
        plugins: [
            //cleanVendors,
            //extractSass,
            new webpack.DllPlugin({
                name: "vendors",
                path: path.join(vendors_dist_dir, "manifest.json")
            })
        ]
    },
    {
        name: "app",
        dependencies: ["vendors"],
        devtool: 'inline-source-map',
        entry: {
            main: "./src/main.ts"
        },
        output: {
            path: app_dist_dir,
            filename: "[name].js"
        },
        resolve: {
            // Add `.ts` and `.tsx` as a resolvable extension.
            extensions: ['.ts', '.tsx'] // note if using webpack 1 you'd also need a '' in the array as well
        },
        module: {
            loaders: [ // loaders will work with webpack 1 or 2; but will be renamed "rules" in future
                // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
                { test: /\.tsx?$/, loader: 'ts-loader' },
                {
                    test: /\.scss$/,
                    use: [{
                        loader: "style-loader" // creates style nodes from JS strings
                    }, {
                        loader: "css-loader" // translates CSS into CommonJS
                    }, {
                        loader: "sass-loader" // compiles Sass to CSS
                    }]
                }
            ]
        },
        plugins: [
            //cleanApp,
            //extractSass,
            new webpack.DllReferencePlugin({
                manifest: path.join(vendors_dist_dir, "manifest.json")
            }),
            new HtmlWebpackPlugin({
                template: path.join(src_dir, "index.html"),
                filename: "../index.html"
            }),
            new FaviconsWebpackPlugin('./src/logo.png'),
            new HtmlWebpackIncludeAssetsPlugin({ assets: [], append: true }),
            new CopyWebpackPlugin([{
                from: "./src/assets",
                to: "./dist/assets"
            }])
        ]
    }
];

