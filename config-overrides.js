
// const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function override(config, env) {

    if (!config.externals) {
        config.externals = {};
    }
    config.externals['createjs'] = 'createjs'; 
    return config;

}; 