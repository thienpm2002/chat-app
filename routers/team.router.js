const express = require('express');
const router = express.Router();
const {isAuth,refreshToken} = require('../helpers/middlewares.js');
const {getTeamChat,createTeam,joinTeam,chatTeam} = require('../controllers/team.controller.js');
router.use('/api',isAuth,refreshToken);

router.post('/api/team-chat',getTeamChat);   // Lấy ra các đoạn tin nhắn của team

router.post('/api/create-team',createTeam);

router.post('/api/join-team',joinTeam);

router.post('/api/chat-team',chatTeam);


module.exports = router;