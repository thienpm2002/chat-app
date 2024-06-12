const express = require('express');
const router = express.Router();
const {isAuth,refreshToken} = require('../jwt/token.js');


router.use('/api',isAuth,refreshToken);

router.get('/api/home',(req,res)=>{
      res.render('home');
 })
 


module.exports = router;  