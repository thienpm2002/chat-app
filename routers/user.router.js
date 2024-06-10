const express = require('express');
const router = express.Router();
const {registerController, loginController,newAccessToken,logoutController} = require('../controllers/user.controller.js');

router.post('/register',registerController);

router.post('/login',loginController);

router.post('/logout',logoutController);

router.post('/refresh-token',newAccessToken);


module.exports = router;    