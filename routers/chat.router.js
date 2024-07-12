const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const iconv = require('iconv-lite');
const {isAuth,refreshToken} = require('../helpers/middlewares.js');
const {getChat,sendMessage,searchChat} = require('../controllers/chat.controller.js');

router.use('/api',isAuth,refreshToken);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'public', 'img','uploads'));
    },
    filename: (req, file, cb) => {
        const originalName = iconv.decode(Buffer.from(file.originalname, 'binary'), 'utf-8');
        cb(null,`${Date.now()}-${originalName}`);
    }
});

const upload = multer({ storage: storage });

router.post('/api/chat',getChat);

router.post('/api/send-message',upload.single('file'),sendMessage);

router.post('/api/search-chat',searchChat);

module.exports = router
