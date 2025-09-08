const express = require('express');
const clientRouter = express.Router();
const clientObject = require('../core/controller/auth/clientController');
const auth = require('../core/middleware/auth');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

module.exports.clientRoutes = (router) => {

    router.use('/client', auth, clientRouter);

    // client get profile and delete profile
    clientRouter.route('/:id')
        .get(clientObject.getClient)
        .delete(clientObject.deleteClient);

    // client create and get list
    clientRouter.route('/')
        .get(clientObject.clientList)
        .post(upload.none(), clientObject.createNewClient);

    // client update and status activate
    clientRouter.route('/:id')
        .put(upload.none(),clientObject.updateClient)
        .patch(clientObject.updateMyStatus)

    // login user profile update route
    // clientRouter.post('/profile', loginObject.updateProfile);
};

