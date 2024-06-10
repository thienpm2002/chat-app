const  {sign,verify} = require('jsonwebtoken');
const createError = require('http-errors');


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
        res.send({
            accesstoken,
        })
}

const sendRefreshToken = (res,refreshtoken) =>{
    res.cookie('refreshtoken',refreshtoken,{
        httpOnly: true,
        path:'/refresh-token'
  })
}
const isAuth = (req,res,next)=>{
     try {
        const token = req.headers['authorization'].split(' ')[1];
        if(!token) throw createError('Authorization');
        const {id} = verify(token, process.env.ACCESS_TOKEN);
        req.userId = id;
        return next();
     } catch (error) {
        if(error.name === 'TokenExpiredError'){
              // Khi token het han
              return res.send({
                error: `${error.message}`,
            })
        }
        return res.status(200).json({
            code: 401,
            message: error.message
         })
     }
}

module.exports = {
    createAccessToken,
    createRefreshToken,
    sendAccessToken,
    sendRefreshToken,
    isAuth
}
