const Database = require('../mongo');
const colors = require('colors');
const config = require('config');

module.exports.initializeApp = async () => {
     try {
        // creating database connection
        const db = new Database(config.get('mongo'));
        await db.connectMongo();

        //creatimng app singleton instance
        const App = require('../app');
        const app = new App();

        // app listening to the port
        app.listen();
        
    } catch (err) {
        console.error(
            'Something went wrong when initializing the server:\n'.red.underline.bold,
            err.stack
        );
    }
};
