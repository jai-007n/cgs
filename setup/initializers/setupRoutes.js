const config = require('config');
const v1Routes = require('../../routes/index.route');

module.exports.setupRoutes = (app) => {
    app.use(config.get('apiPrefix'), v1Routes);
};

