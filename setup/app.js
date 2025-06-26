const express = require('express');
const compression = require('compression');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const path = require('path');
const config = require('config');
const { setupRoutes } = require('./initializers/setupRoutes');

module.exports = class App {

    constructor() {
        this.app = express();
        if (!config.get('JWT_PRIVATE_KEY')) {
            console.log('FATAL ERROR : jwtPrivateKey is not defined')
            process.exit()
        }
        this.app.use(helmet());
        // require('./swagger-setup')(this.app);
        this.app.use(cors({
            origin: '*',
            preflightContinue: true,
            methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Origin', 'X-Requested-With', 'content-disposition',
                'Content-Type', 'Accept', 'Authorization', 'x-auth-token', 'x-time-zone', 'x-hmac-token']
        }));
        this.app.use(compression());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        this.app.use(cookieParser());
        this.app.use(express.static(path.join(__dirname, 'public')));

        this.app.use('/public/', express.static('./public/Images'))
        this.setRoutes();
        this.notFound();
    }

    

    setRoutes() {
       setupRoutes(this.app);
        // error handler
        this.app.use(function (err, req, res, next) {
            if (err) {
                return res.status(err.code || 500).json({
                    status: false,
                    code: err.code || 500,
                    message: err.message || "something went wrong".red.underline.bold,
                });
            }
            next()
        });
    }

    notFound() {
        this.app.use((req, res) => {
            res.status(404).json({
                success: false,
                msg: 'Endpoint not found !'
            })
        });
    }

    getApp() {
        return this.app;
    }

    getEnv() {
        return this.app.get('env');
    }

    listen() {
        const PORT = config.get('port') || 5000;
        this.app.listen(PORT, () => {
            console.log(`Listening at PORT ${PORT}`.yellow.underline.bold);
        });
    }
}
