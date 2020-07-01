const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE==='true'
});
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');




module.exports = withBundleAnalyzer({
    distDir: '.next',
    // webpack(config){
    //     console.log(config);
    //     return config;
    // },
    webpack: (config)=>{
        console.log(config);
        console.log(process.env.NODE_ENV);

        const prod = process.env.NODE_ENV === 'production';
        
        const plugins = [
            ...config.plugins,
            new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /^\.\/ko$/),
        ];
        
        if(prod){
            plugins.push(new CompressionPlugin());
        }
        
        return {
            ...config,
            mode: prod ? 'production' : 'development',
            devtool: prod ? 'hidden-source-map': 'eval',
            plugins
        };
    }
});