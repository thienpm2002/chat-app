const express = require('express');
const router = express.Router();
const {isAuth} = require('../jwt/token.js');


router.use('/home',isAuth);

router.get('/home',(req,res)=>{
      const Id = req.userId;
      res.json({Id});
})


module.exports = router;  