const pool = require('../config/database.js');
const {userRegisterValidate, userLoginValidate} = require('../config/validation.js');
const createError = require('http-errors');
const { hash, compare} = require('bcryptjs');  
const  {createAccessToken,createRefreshToken,sendAccessToken,sendRefreshToken} = require('../jwt/token.js');
const { verify } = require('jsonwebtoken');

// Xử lý đăng ký
const registerController = async (req,res) => {

    try {

        const {email, password, name} = req.body;

        const {error} =  userRegisterValidate(req.body);
        if(error) throw createError(error.details[0].message);
        
        const hashedPassword = await hash(password,10);

        const [row] = await pool.query('SELECT * FROM users WHERE Email = ?',[email]);
        if(row.length > 0) {
            return res.send('User is exits.');
        }

        await pool.query('INSERT INTO users (Name, Email, Password) VALUES (?,?,?)',[name,email,hashedPassword]);
        res.json({
            status: 'ok',
            message: 'User created',
        })
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
// Xử lý login
const loginController = async (req,res) => {

    try {

        const {email,password} = req.body;

        const {error} = userLoginValidate(req.body);
        if(error) throw createError(error.details[0].message);

        const [row] = await pool.query('SELECT * FROM users WHERE Email = ?',[email]);
        const [user] = row;
        if(user) {

            const valid = await compare(password, user.Password);
            if(!valid) throw createError('Password khong chinh xac');

            const accessToken = createAccessToken(user.Id);
            const refreshToken = createRefreshToken(user.Id);
            
            await pool.query('UPDATE users SET Refreshtoken = ? WHERE Id = ?', [refreshToken, user.Id]);

            sendRefreshToken(res,refreshToken);
            return sendAccessToken(res,accessToken)
        }

        res.send('Tai khoan khong ton tai');

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const newAccessToken = async (req,res) =>{
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
      return sendAccessToken(res,accessToken)

}

const logoutController = async (req,res)=>{
    res.clearCookie('refreshtoken',{ path: '/refresh-token' });
    res.send('Logout thanh cong');
}

module.exports = {
    registerController,
    loginController,
    newAccessToken,
    logoutController
}