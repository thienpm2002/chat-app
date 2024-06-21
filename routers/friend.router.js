const express = require('express');
const router = express.Router();
const {sendAddFriend,addFriend,rejectedFriend} = require('../controllers/friend.controller.js');
const {isAuth,refreshToken} = require('../helpers/middlewares.js');

router.use('/api',isAuth,refreshToken);


router.post('/api/send-friend',sendAddFriend);


router.post('/api/add-friend',addFriend);


router.post('/api/reject-friend',rejectedFriend);






module.exports = router;