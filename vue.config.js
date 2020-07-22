
const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    publicPath : "./",
    assetsDir : "",
    productionSourceMap : false,
    lintOnSave:false,
    devServer: {
        open: true,
        // host: 'localhost',
        port: 3000,
        https: false,
        hotOnly: false,
    },
    chainWebpack: config => {
        if (process.env.NODE_ENV === 'dev') {
            

        } else {
        }
        config.resolve.alias
        .set('@@',resolve('/'))
        .set('@',resolve('/src'))
        .set('_c', resolve('src/components'))

        config.plugins.delete('prefetch');
        if (process.env.npm_config_report) {
            config.plugin('webpack-bundle-analyzer')
                .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
                .end();
            config.plugins.delete('prefetch') 
        }
    },

    configureWebpack: (config) => {
        config.module.rules.push({            
            test: /\.js$/,
            include:/src/, 
            exclude:/(node_modules|public|sdk)/ ,
            use: {
                loader: 'babel-loader',
            }
        })
        if (process.env.NODE_ENV === 'production') {
            // 去除console.log代码
            // 测试
            config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true

            let optimization = {
                runtimeChunk: 'single',
                splitChunks: {
                    chunks: 'all',
                    maxInitialRequests: Infinity,
                    minSize: 20000, // 依赖包超过20000bit将被单独打包
                    cacheGroups: {
                        vendor: {
                            test: /[\\/]node_modules[\\/]/,
                            name(module) {
                                // get the name. E.g. node_modules/packageName/not/this/part.js
                                // or node_modules/packageName
                                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
                                // npm package names are URL-safe, but some servers don't like @ symbols
                                return `npm.${packageName.replace('@', '')}`
                            }
                        }
                    }
                }
            }
            Object.assign(config.optimization, optimization)


        }
    }

}