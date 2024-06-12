const  {sign,verify} = require('jsonwebtoken');
const createError = require('http-errors');
const pool = require('../config/database.js');

const createAccessToken = (id) =>{
      return sign({id},process.env.ACCESS_TOKEN,{
        expiresIn: '1m',
      })
}

const createRefreshToken = (id) =>{
    return sign({id},process.env.REFRESH_TOKEN,{
      expiresIn: '7d',
    })
}

const sendAccessToken = (res,accesstoken) =>{
      res.cookie('accesstoken',accesstoken,{
        httpOnly: true,
        path:'/api'
    })
}

const sendRefreshToken = (res,refreshtoken) =>{
    res.cookie('refreshtoken',refreshtoken,{
        httpOnly: true,
        path:'/api'
  })
}
const isAuth = (req,res,next)=>{
     try {
        if(!req.cookies.accesstoken) throw createError('Authorization');
        const token = req.cookies.accesstoken;
        if(!token) throw createError('Authorization');
        const {id} = verify(token, process.env.ACCESS_TOKEN);
        req.userId = id;
        return next();
     } catch (error) {
        if(error.name === 'TokenExpiredError'){
              // Khi token het han
             res.error = `${error.message}`;
             return next();
        }
        return res.status(200).json({
            code: 401,
            message: error.message
         })
     }
}
const refreshToken = async (req,res,next) => {
       if(res.error === 'jwt expired'){
        const token = req.cookies.refreshtoken;
        if(!token) return res.send({message:'Khong thấý token'});
  
        const payload = verify(token, process.env.REFRESH_TOKEN);
        if(!payload)  return res.send({message:'Lỗi giải mã'});
        
        const [row] = await pool.query('SELECT * FROM users WHERE Id = ?',[payload.id]);
        const [user] = row;
        if(!user) return res.send({message:'Khong thấý user'});
        if(user.Refreshtoken !== token)  return res.send({message:'Khong thấý token trong database'});
        
        const accessToken = createAccessToken(user.Id);
        const refreshToken = createRefreshToken(user.Id);
        await pool.query('UPDATE users SET Refreshtoken = ? WHERE Id = ?', [refreshToken, user.Id]);
  
        sendRefreshToken(res,refreshToken);
        sendAccessToken(res,accessToken);
        return next();
       }
       next();
}

module.exports = {
    createAccessToken,
    createRefreshToken,
    sendAccessToken,
    sendRefreshToken,
    isAuth,
    refreshToken
}
