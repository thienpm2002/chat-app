const express = require('express');
const router = express.Router();
const {registerController, loginController,logoutController,registerPage,loginPage} = require('../controllers/user.controller.js');



router.get('/register',registerPage)

router.post('/register',registerController);

router.get('/login',loginPage)

router.post('/login',loginController);

router.post('/logout',logoutController);




module.exports = router;    