const pool = require('../config/database.js');


const getChat = async (req,res) =>{
       const receiver_id = parseInt(req.body.id);
       const sender_id = req.userId;
       try {
            const [result] = await pool.query('SELECT * FROM users WHERE users.Id = ?',[receiver_id]);
            const [relationship] = await pool.query('select relationship from friend where (user_1 = ? and user_2 =?) or (user_1 = ? and user_2 =?)',[sender_id,receiver_id,receiver_id,sender_id]);
            const [messages] = await pool.query('SELECT * FROM message WHERE (sender_id = ? and receiver_id = ?) or (sender_id = ? and receiver_id = ?)',[sender_id,receiver_id,receiver_id,sender_id]);
            return res.send({ messages: messages, receiver: result[0], relationship: relationship[0].relationship });
       } catch (error) {
          return res.status(500).json({error: error.message});
       }
}



const sendMessage = async (req,res) =>{  
        const {message} = req.body;
        const receiver_id= parseInt(req.body.receiver_id);
        const sender_id = req.userId;
        let filePath = '';
        try {
            if(req.file){
                 filePath = `/img/uploads/${req.file.filename}`;
                await pool.query('INSERT INTO message (sender_id, receiver_id, content) VALUES (?,?,?)',[sender_id,receiver_id,filePath]);
            }
            if(message){
                await pool.query('INSERT INTO message (sender_id, receiver_id, content) VALUES (?,?,?)',[sender_id,receiver_id,message]);
            }
            const [user_1] = await pool.query('select * from users where Id = ?',[receiver_id]);
            const [user_2] = await pool.query('select * from users where Id = ?',[sender_id]);
            return res.send({receiver: user_1[0], sender: user_2[0],filePath: filePath});
        } catch (error) {
            return res.status(500).json({error: error.message});
        }
}




const searchChat = async (req,res) =>{
    const {name} = req.body;
    const id = req.userId;

    try {
        const [user] = await pool.query('select * from users where Id != ? and Name = ?',[id, name]);
        return res.send({users: user});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}





module.exports = {
    getChat,
    sendMessage,
    searchChat,
}