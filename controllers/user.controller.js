const pool = require('../config/database.js');
const {userRegisterValidate, userLoginValidate} = require('../config/validation.js');
const createError = require('http-errors');
const { hash, compare} = require('bcryptjs');  
const  {createAccessToken,createRefreshToken,sendAccessToken,sendRefreshToken} = require('../helpers/token.js');
const fs = require('fs');
const path = require('path');



const registerPage = (req,res) =>{
    res.render('register');
}
// Xử lý đăng ký
const registerController = async (req,res) => {

    try {

        const {email, password, name} = req.body;
        const img = '/img/user.jpg';
        const {error} =  userRegisterValidate(req.body);
        if(error) throw createError(error.details[0].message);
        
        const hashedPassword = await hash(password,10);

        const [row] = await pool.query('SELECT * FROM users WHERE Email = ?',[email]);
        if(row.length > 0) {
            return res.send('User already exists.');
        }

        await pool.query('INSERT INTO users (Name, Email, Password, Image) VALUES (?,?,?,?)',[name,email,hashedPassword,img]);
        res.redirect('/login');
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


const loginPage = (req,res) =>{
    res.render('login');
}
// Xử lý login
const loginController = async (req,res) => {

    try {
        const status = 'on';
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
            
            await pool.query('UPDATE users SET Refreshtoken = ?, Status = ? WHERE Id = ?', [refreshToken,status, user.Id]);

            sendRefreshToken(res,refreshToken);
            sendAccessToken(res,accessToken);

           return res.redirect('/api/home');
             
        }

        res.send('Tai khoan khong ton tai');

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


const logoutController = async (req,res)=>{
    const status = 'off';
    const id = req.userId;
    await pool.query('UPDATE users SET Status = ? WHERE Id = ?', [status, id]);
    res.clearCookie('refreshtoken',{ path: '/api' });
    res.clearCookie('accesstoken',{ path: '/api' });
    return res.send({
        message:'Logout thanh cong'
    })
}

const updateUser = async (req,res)=>{
    try {
        const img = `/img/uploads/${req.file.filename}`;
        console.log(img)
        const {name} = req.body;
        console.log(name);
        const id = req.userId;
        console.log(id);
        const [result] = await pool.query('SELECT * FROM users WHERE Id = ? ',[id]);
        const [user] = result;
        if(user.Image !== null){
            const img_url = path.join(__dirname,'..','public',user.Image);
            fs.unlink(img_url,(err)=>{
                if (err) throw err;
                console.log('File deleted!');
            })
        }
       await pool.query('UPDATE users SET Name = ?,Image= ? WHERE Id = ?',[name,img,id]); 
       const [newResult] = await pool.query('SELECT * FROM users WHERE Id = ? ',[id]);
       return res.send({
             user: newResult[0]
       });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const searchUser = async (req,res) => {
    try {
        const id = req.userId;
        const {name} = req.body;
        const [users] = await pool.query('select u.Name, u.Id, u.Image, f.user_1, f.user_2,f.relationship from users as u LEFT JOIN friend as f  on (u.Id = f.user_2 or u.Id = f.user_1) where u.Name = ? and (user_1 = ? or user_2 = ?);',[name,id,id]);
        const [relust] = await pool.query('select * from users where Name = ?',[name]);
        return res.send({users_1:users,users_2:relust});                                 
    } catch (error) {
        return res.status(500).json({message: `${error.message}`});
    }
}

const offEvent = async (req,res)=>{
    try {
       
        const {userId,status} = req.body;
        await pool.query('UPDATE users SET Status = ? WHERE Id = ?', [status, userId]);
        return res.send({
            message:'User off'
        })
    } catch (error) {
        return res.status(500).json({message: `${error.message}`});
    }
    
}

const onEvent = async (req,res)=>{
    try {
      
        const {userId,status} = req.body;
        await pool.query('UPDATE users SET Status = ? WHERE Id = ?', [status, userId]);
        return res.send({
            message:'User on'
        })
    } catch (error) {
        return res.status(500).json({message: `${error.message}`});
    }
    
}

module.exports = {
    registerPage,
    registerController,
    loginPage,
    loginController,
    logoutController,
    updateUser,
    searchUser,
    offEvent,
    onEvent
}