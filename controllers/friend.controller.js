const pool = require('../config/database.js');




const sendAddFriend = async (req,res) => {
      try {
          const friend_id = parseInt(req.body.fromId);    // Thang minh muon ket ban
          const id = req.userId;
          await pool.query('INSERT INTO friend (user_1, user_2) VALUES (?,?)',[id,friend_id]);
          const [relust] = await pool.query('SELECT * FROM users WHERE Id = ?',[id]);
          return res.send({toId:id, fromId: friend_id, user:relust[0]});
      } catch (error) {
        res.status(500).json({message: error.message});
      }
}

const addFriend = async (req,res) => {
    try {
        const friend_id = req.body.toId;  // Thang gui
        const id = req.userId;
        const status = 'accepted';
        await pool.query('update friend set relationship = ? where user_1 = ? and user_2 = ?',[status,friend_id,id]);
        const [relust_1] = await pool.query('SELECT * FROM users WHERE Id = ?',[id]);
        const [relust_2] = await pool.query('SELECT * FROM users WHERE Id = ?',[friend_id]);
        return res.send({user: relust_1[0], user_2:  relust_2[0] });
    } catch (error) {
      res.status(500).json({message: error.message});
    }
}


const rejectedFriend = async (req,res) => {
    try {
        const friend_id = req.body.toId;  // Thang gui
        const id = req.userId;
        await pool.query('delete from friend where user_1 = ? and user_2 = ?',[friend_id,id]);
        const [relust_1] = await pool.query('SELECT * FROM users WHERE Id = ?',[id]);
        const [relust_2] = await pool.query('SELECT * FROM users WHERE Id = ?',[friend_id]);
        return res.send({user: relust_1[0], user_2:  relust_2[0] });
    } catch (error) {
      res.status(500).json({message: error.message});
    }
}



module.exports = {
    sendAddFriend,
    addFriend,
    rejectedFriend
}