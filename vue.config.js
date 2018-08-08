var webpack = require('webpack')
module.exports = {
    chainWebpack: config => {
        config
        .plugin('jquery')
        .use(webpack.ProvidePlugin, [{ jQuery: 'jquery' } ])  
    }
}