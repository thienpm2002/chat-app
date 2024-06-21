const express = require('express');
const router = express.Router();
const {isAuth,refreshToken} = require('../helpers/middlewares.js');
const {homePage,contactPage} = require('../controllers/page.controller.js');

router.use('/api',isAuth,refreshToken);

router.get('/api/home',homePage)
 
router.get('/api/contact',contactPage);

module.exports = router;  