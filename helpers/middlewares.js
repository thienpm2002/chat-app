
const  {verify} = require('jsonwebtoken');
const createError = require('http-errors');
const pool = require('../config/database.js');
const {createAccessToken,createRefreshToken,sendAccessToken,sendRefreshToken,} = require('./token.js');

const isAuth = (req, res, next) => {
    try {
        console.log(req.cookies.accesstoken);
        if (!req.cookies.accesstoken) {
            throw new createError.Unauthorized('Access token is missing');
        }
  
        const token = req.cookies.accesstoken;
        const decoded = verify(token, process.env.ACCESS_TOKEN);
  
        if (!decoded || !decoded.id) {
            throw new createError.Unauthorized('Invalid token payload');
        }
  
        req.userId = decoded.id;
        return next();
    } catch (error) {
        console.error('Auth error:', error.message);
  
        if (error.name === 'TokenExpiredError') {
          res.error = `${error.message}`;
          return next();
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                code: 401,
                message: 'Invalid token. Please log in again.'
            });
        } else {
            return res.status(401).json({
                code: 401,
                message: error.message
            });
        }
    }
  };
  
  const refreshToken = async (req, res, next) => {
    try {
        if (res.error === 'jwt expired') {
            const refreshToken = req.cookies.refreshtoken;
            if (!refreshToken) {
                throw new createError.Unauthorized('Refresh token is missing');
            }
  
            const payload = verify(refreshToken, process.env.REFRESH_TOKEN);
            if (!payload || !payload.id) {
                throw new createError.Unauthorized('Invalid refresh token');
            }
  
            const [row] = await pool.query('SELECT * FROM users WHERE Id = ?', [payload.id]);
            const user = row[0];
            if (!user || user.Refreshtoken !== refreshToken) {
                throw new createError.Unauthorized('Invalid refresh token');
            }
  
            // Refresh tokens and set cookies
            const accessToken = createAccessToken(user.Id);
            const newRefreshToken = createRefreshToken(user.Id);
            await pool.query('UPDATE users SET Refreshtoken = ? WHERE Id = ?', [newRefreshToken, user.Id]);
  
            // Set new tokens in cookies
            sendRefreshToken(res, newRefreshToken);
            sendAccessToken(res, accessToken);
            console.log('Lấy lại token thanh cong');
            req.userId = user.Id; // Set userId in request for next middleware/route
        }
    } catch (error) {
        console.error('Refresh token error:', error.message);
        return res.status(401).json({
            code: 401,
            message: error.message
        });
    }
  
    next();
  };


  
module.exports = {
    isAuth,
    refreshToken,
}