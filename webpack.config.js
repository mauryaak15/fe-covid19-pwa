const path = require('path');
const config = require('config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const WorkboxPlugin = require('workbox-webpack-plugin');

let DEBUG;
const CONFIG = config.has('app') ? config.get('app') : {};

if (process.env.NODE_ENV === 'production') {
    DEBUG = false;
} else {
    DEBUG = true;
}
module.exports = {
    target: ['web', 'es5'],
    entry: path.resolve(__dirname, 'src', 'index.tsx'),
    mode: process.env.NODE_ENV,
    output: {
        filename: DEBUG
            ? './static/js/bundle.js'
            : './static/js/[name].[contenthash].min.js',
        path: path.join(__dirname, 'dist'),
        publicPath: 'auto',
        clean: true,
        chunkFilename: DEBUG
            ? './static/js/bundle.chunk.js'
            : './static/js/[id].[contenthash].chunk.min.js',
        asyncChunks: true,
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        alias: {
            '@components': path.resolve(__dirname, 'src/components'),
            '@containers': path.resolve(__dirname, 'src/containers'),
            '@utils': path.resolve(__dirname, 'src/utils'),
            '@hooks': path.resolve(__dirname, 'src/hooks'),
            '@assets': path.resolve(__dirname, 'src/assets'),
            '@libs': path.resolve(__dirname, 'src/libs'),
            '@pages': path.resolve(__dirname, 'src/pages'),
            '@store': path.resolve(__dirname, 'src/store'),
            '@typings': path.resolve(__dirname, 'src/typings'),
        },
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        port: 3000,
        hot: false,
        devMiddleware: {
            writeToDisk: true,
        },
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|tsx|ts)$/i,
                exclude: /node_modules/,
                // use: 'babel-loader',
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [['@babel/preset-env', {targets: 'defaults'}]],
                        // presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-transform-runtime'], // for async/await
                    },
                },
            },
            {
                test: /\.css$/i,
                use: [
                    DEBUG
                        ? 'style-loader'
                        : {
                              loader: MiniCssExtractPlugin.loader,
                          },
                    {
                        loader: 'css-loader',
                        // BUG css modules doesn't work with tailwindcss
                        // options: {
                        //     modules: true,
                        //     importLoaders: 1,
                        // },
                    },
                    // 'postcss-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: ['autoprefixer'],
                            },
                        },
                    },
                ],
            },
            // BUG scss doesn't work properly with tailwindcss
            // {
            //     test: /\.s[ca]ss$/i,
            //     use: [
            //         DEBUG
            //             ? 'style-loader'
            //             : {
            //                   loader: MiniCssExtractPlugin.loader,
            //               },
            //         {
            //             loader: 'css-loader',
            //             options: {
            //                 modules: true,
            //                 importLoaders: 2,
            //             },
            //         },
            //         'postcss-loader',
            //         // {
            //         //     loader: 'postcss-loader',
            //         //     options: {
            //         //         postcssOptions: {
            //         //             plugins: ['autoprefixer'],
            //         //         },
            //         //     },
            //         // },
            //         'sass-loader',
            //     ],
            // },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/,
                type: 'asset/resource',
                generator: {
                    filename: DEBUG
                        ? './static/media/[name][ext][query]'
                        : './static/media/[name]_[hash][ext][query]',
                },
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                type: 'asset/resource',
                generator: {
                    filename: DEBUG
                        ? './static/fonts/[name][ext][query]'
                        : './static/fonts/[name]_[hash][ext][query]',
                },
            },
            {
                test: /\.js$/i,
                enforce: 'pre',
                use: ['source-map-loader'],
            },
        ],
    },
    devtool: DEBUG ? 'cheap-module-source-map' : 'source-map',
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'public', 'index.html'),
            filename: './index.html',
        }),
        new ForkTsCheckerWebpackPlugin(),
        new MiniCssExtractPlugin({
            chunkFilename: DEBUG
                ? './static/css/main.chunk.css'
                : './static/css/[id].[contenthash].chunk.min.css',
            filename: DEBUG
                ? './static/css/main.css'
                : './static/css/[name].[contenthash].min.css',
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: 'public',
                    to: '',
                    globOptions: {
                        ignore: ['**/*.html', '**/.DS_Store'],
                    },
                    noErrorOnMissing: true,
                },
            ],
        }),
        new webpack.DefinePlugin({
            CONFIG: JSON.stringify(CONFIG),
        }),
        new WorkboxPlugin.InjectManifest({
            swSrc: './src/sw.js',
            swDest: 'sw.js',
        }),
    ],
};
