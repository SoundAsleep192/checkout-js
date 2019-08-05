const { join } = require('path');

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = function (options, argv) {
    const mode = argv.mode || 'development';
    const isProduction = mode !== 'development';

    return {
        entry: {
            'checkout': join(__dirname, 'src', 'app', 'App.ts'),
        },
        mode,
        devtool: isProduction ? 'source-map' : 'eval-source-map',
        resolve: {
            extensions: ['.ts', '.tsx', '.js'],
            mainFields: ['module', 'browser', 'main'],
        },
        optimization: {
            // Can cause issues with circular dependencies
            concatenateModules: false,
            runtimeChunk: 'single',
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    transients: {
                        test: ({ resource }) => /\/node_modules\/@bigcommerce/.test(resource),
                        reuseExistingChunk: true,
                        enforce: true,
                    },
                },
            },
        },
        output: {
            path: isProduction ? join(__dirname, 'dist') : join(__dirname, 'build'),
            filename: `[name]${isProduction ? '-[contenthash:8]' : ''}.js`,
            chunkFilename: `[name]${isProduction ? '-[contenthash:8]' : ''}.js`,
            jsonpFunction: 'checkout',
        },
        plugins: [
            isProduction && new MiniCssExtractPlugin({
                filename: `[name]${isProduction ? '-[contenthash:8]' : ''}.css`,
                chunkFilename: `[name]${isProduction ? '-[contenthash:8]' : ''}.css`,
            }),
            new ForkTsCheckerWebpackPlugin({
                async: !isProduction,
                tslint: true,
            }),
        ].filter(Boolean),
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    include: join(__dirname, 'src'),
                    use: [
                        {
                            loader: 'ts-loader',
                            options: {
                                onlyCompileBundledFiles: true,
                                transpileOnly: true,
                            },
                        },
                    ],
                },
                {
                    test: /\.scss$/,
                    use: [
                        isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                        'css-loader',
                        'sass-loader',
                    ],
                    sideEffects: true,
                },
            ],
        },
    };
};