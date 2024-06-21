const  {sign} = require('jsonwebtoken');


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


module.exports = {
    createAccessToken,
    createRefreshToken,
    sendAccessToken,
    sendRefreshToken,
}
