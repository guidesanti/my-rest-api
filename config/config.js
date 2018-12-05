var config = {

    getEnv() {
        var env = 'local';
      
        if (process.env.NODE_ENV == 'production') {
            env = 'prod';
        } else if (process.env.NODE_ENV == 'development') {
            env = 'dev';
        } else {
            env = 'local';
        }
      
        return env;
    },

    getAppConfig() {
        return require('./app-config-' + this.getEnv() + '.json');
    },

    getWinstonConfig() {
        return require('./winston-config-' + this.getEnv() + '.json');
    }

}

module.exports = config;
