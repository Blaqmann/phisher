// craco.config.js
module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            webpackConfig.module.rules.forEach((rule) => {
                if (rule.enforce === 'pre' && rule.use && rule.use[0] && rule.use[0].loader === 'source-map-loader') {
                    rule.exclude = rule.exclude || [];
                    rule.exclude.push(/react-loader-spinner/);
                }
            });
            return webpackConfig;
        }
    }
};