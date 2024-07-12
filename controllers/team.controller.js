const pool = require('../config/database.js');
const codeTeam = require('../helpers/secretKey.js');



const getTeamChat = async (req,res) => {
       const id = req.userId;
       const {teamId} = req.body;
       try {
          const [members] = await pool.query(`select t.Name, t.Image, t.code, m.SL from teams as t 
                                            join (
                                                select team_id, count(member_id) as SL from members
                                                group by  team_id
                                            )as m on t.Id = m.team_id
                                            where t.Id = ?;
                                            `,[teamId]);
            const [messages] = await pool.query(`select u.Id, u.Name,u.Image, m.content, m.created_at from users as u 
                                                    join message_team as m on u.Id = m.sender_id 
                                                    where m.team_id = ?
                                                    order by m.created_at;`,[teamId]);      
            return res.send({members:members[0], messages:messages, userId:id});                                                              
       } catch (error) {
           return res.status(500).json({error: `${error.message}`});
       }
}

const createTeam = async (req,res) => {
    const id = req.userId;
    const code = codeTeam(8);
    const name = req.body.name;
    const img = '/img/team.jpg';
    try {
        await pool.query('insert into teams (Name,Image,creater_id,code) values (?,?,?,?)',[name,img,id,code]);   
        return res.redirect('/api/team');                                                              
    } catch (error) {
        return res.status(500).json({error: `${error.message}`});
    }
}

const joinTeam = async (req,res) => {
    const id = req.userId;
    const code = req.body.code;
    try {
        const [reuslt] = await pool.query('select * from teams where code = ?',[code]);
        if(reuslt.length >0){
            const team_id = reuslt[0].Id;
            await pool.query('insert into members (team_id,member_id) values (?,?)',[team_id,id]);  
            return res.redirect('/api/team');
        }   
        return res.send({
            message: 'Code khong dung'
        });                                                               
    } catch (error) {
        return res.status(500).json({error: `${error.message}`});
    }
}


const  chatTeam = async (req,res) => {
    const id = req.userId;
    console.log(req.body);
    const message = req.body.message;
    const teamId = parseInt(req.body.teamId);
    try {
        await pool.query('insert into message_team (team_id, sender_id, content) values (?,?,?)',[teamId,id,message]);  
        const [reuslt] = await pool.query(` select t.Id as team_id, t.Name as team_name, t.Image as team_img, u.Name as sender_name,u.Image as sender_img from users as u 
                                            join message_team as m on u.Id = m.sender_id 
                                            join teams as t on m.team_id = t.Id
                                            where t.Id = ? and m.sender_id = ?
                                            group by team_name, team_img, sender_name, sender_img;`,[teamId,id]);
        return res.send({sender:reuslt[0],message:message});                                                                  
    } catch (error) {
        return res.status(500).json({error: `${error.message}`});
    }
}



module.exports = {
    getTeamChat,
    createTeam,
    joinTeam,
    chatTeam
}