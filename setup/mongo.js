const mongoose = require("mongoose");
const colors = require('colors');
module.exports = class SetupMongo {

    constructor(mongo) {

        const { database, url } = mongo;
        this.connectionUri = `${url}/${database}`;
        // const connectionUri = `${protocol}${username}:${encodeURIComponent(password)}@${url}/${database}?authSource=admin`;
        console.log("connection uri is ", this.connectionUri.blue.underline.bold)
    }

    async connectMongo() {
        try {
            await mongoose.connect(this.connectionUri);
            console.log("MongoDb is connected successfully".green.underline.bold)
        } catch (err) {
            throw new Error(err.red.underline.bold);
        };
    }

    disconnectMongo() {
        mongoose.disconnect()
            .then(() => console.log('MongoDB Disconnected'.magenta.underline.bold))
            .catch(err => console.error('MongoDB Disconnection Error:', err.red.underline.bold));
    }

    async resetMongo() {
        await mongoose.connection.dropDatabase();
        console.log('MongoDB Refresh with clearing database'.grey.underline.bold)
    }

    async clearCollections() {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            const collection = collections[key];
            try {
                await collection.deleteMany();
                console.log(`Cleared ${key}`);
            } catch (err) {
                console.error(`Failed to clear ${key}:`, err);
            }
        }
    }
}