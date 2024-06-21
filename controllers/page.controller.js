const pool = require('../config/database.js');



const homePage = async (req,res) => {
    try {
        if(!req.userId) return res.send('Loi deo gi day');
        const id = req.userId;
        const status = 'accepted';
        const [reslut] = await pool.query('SELECT * FROM users WHERE Id = ?', [id]);
        const [user] = reslut;
        const [listFriend] = await pool.query(`
            SELECT u.Id, u.Name, u.Image, u.Status 
            FROM users u 
            JOIN friend f ON u.Id = f.user_2 
            WHERE f.user_1 = ? AND f.relationship = ? 
            UNION 
            SELECT u.Id, u.Name, u.Image, u.Status 
            FROM users u 
            JOIN friend f ON u.Id = f.user_1 
            WHERE f.user_2 = ? AND f.relationship = ?
        `, [id, status, id, status]);
        return res.render('home',{ user: user, friends: listFriend});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const contactPage = async (req,res) => {
    try {
        if(!req.userId) return res.send('Loi deo gi day');
        const id = req.userId;
        const status = 'accepted';
        const pending = 'pending'
        const [reslut] = await pool.query('SELECT * FROM users WHERE Id = ?', [id]);
        const [user] = reslut;
        const [listFriend] = await pool.query(`
            SELECT u.Id, u.Name, u.Image, u.Status 
            FROM users u 
            JOIN friend f ON u.Id = f.user_2 
            WHERE f.user_1 = ? AND f.relationship = ? 
            UNION 
            SELECT u.Id, u.Name, u.Image, u.Status 
            FROM users u 
            JOIN friend f ON u.Id = f.user_1 
            WHERE f.user_2 = ? AND f.relationship = ?
        `, [id, status, id, status]);
        const [listPending] = await pool.query(`
            SELECT *
            FROM users u 
            JOIN friend f ON u.Id = f.user_2 
            WHERE f.user_1 = ? AND f.relationship = ? 
            UNION 
            SELECT *
            FROM users u 
            JOIN friend f ON u.Id = f.user_1 
            WHERE f.user_2 = ? AND f.relationship = ?
        `, [id, pending, id, pending]);

        return res.render('contact',{ user: user, friends: listFriend, pendings: listPending});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


module.exports = {
    homePage,
    contactPage
}