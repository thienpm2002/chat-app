
const  {verify} = require('jsonwebtoken');
const createError = require('http-errors');
const pool = require('../config/database.js');
const {createAccessToken,createRefreshToken,sendAccessToken,sendRefreshToken,} = require('./token.js');




const isAuth = (req, res, next) => {
    try {
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
  
let isRefreshingToken = false;
const tokenRefreshQueue = [];

const refreshToken = async (req, res, next) => {
    try {
        if (res.error === 'jwt expired') {
            if (isRefreshingToken) {
                return res.status(429).json({
                    code: 429,
                    message: 'Token is already being refreshed. Please try again later.'
                });
            }

            isRefreshingToken = true;

            const refreshTokenValue = req.cookies.refreshtoken;
            console.log('Received Refresh Token:', refreshTokenValue);

            if (!refreshTokenValue) {
                throw new createError.Unauthorized('Refresh token is missing');
            }

            const payload = verify(refreshTokenValue, process.env.REFRESH_TOKEN);
            if (!payload || !payload.id) {
                throw new createError.Unauthorized('Invalid token payload');
            }

            const [rows] = await pool.query('SELECT * FROM users WHERE Id = ?', [payload.id]);
            if (rows.length === 0) {
                throw new createError.Unauthorized('User not found');
            }

            const user = rows[0];
            console.log('User from DB:', user);
            console.log('User Refreshtoken:', user.Refreshtoken);
            if (user.Refreshtoken !== refreshTokenValue) {
                throw new createError.Unauthorized('Lỗi không có user hoặc refrechtoken database');
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

            isRefreshingToken = false;
            processQueue(); // Process pending token refresh requests
        }
    } catch (error) {
        console.error('Refresh token error:', error.message);
        isRefreshingToken = false;
        return res.status(401).json({
            code: 401,
            message: error.message
        });
    }

    next();
};

const processQueue = () => {
    const queuedRequest = tokenRefreshQueue.shift();
    if (queuedRequest) {
        refreshToken(queuedRequest.req, queuedRequest.res, queuedRequest.next)
            .then(queuedRequest.resolve)
            .catch(queuedRequest.reject);
    }
};


  
module.exports = {
    isAuth,
    refreshToken,
}