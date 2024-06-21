const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {registerController, loginController,logoutController,registerPage,loginPage,updateUser,searchUser} = require('../controllers/user.controller.js');
const {isAuth,refreshToken} = require('../helpers/middlewares.js');

router.use('/api',isAuth,refreshToken);
// Config multer

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'public', 'img'));
    },
    filename: (req, file, cb) => {
        cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

router.get('/register',registerPage)

router.post('/register',registerController);

router.get('/login', loginPage)

router.post('/login',loginController);

router.post('/logout',logoutController);

router.put('/api/update',upload.single('img'),updateUser);

router.post('/api/search-user',searchUser);


module.exports = router;    