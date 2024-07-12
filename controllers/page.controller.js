const pool = require('../config/database.js');



const homePage = async (req,res) => {
    try {
        if(!req.userId) return res.send('Loi deo gi day');
        const id = req.userId;
        const [reslut] = await pool.query('SELECT * FROM users WHERE Id = ?', [id]);
        const [user] = reslut;
        const [messages] = await pool.query(`
            select c.Id, 
            c.Name, 
            c.Image, 
            c.Status,
            message.sender_id,
            message.created_at,
            c.content from ( SELECT 
                            u.Id, 
                            u.Name, 
                            u.Image, 
                            u.Status, 
                            m.content, 
                            m.Id as message_id,
                            m.created_at AS latest_created_at
                        FROM 
                            users u
                        JOIN 
                            (SELECT 
                                CASE 
                                    WHEN sender_id = ? THEN receiver_id
                                    ELSE sender_id 
                                END AS user_id,
                                content,
                                created_at,
                                Id
                            FROM 
                                message m
                            WHERE 
                                (sender_id = ? OR receiver_id = ?)
                                AND created_at = (
                                    SELECT MAX(created_at)
                                    FROM message
                                    WHERE 
                                        (sender_id = m.sender_id AND receiver_id = m.receiver_id)
                                        OR (sender_id = m.receiver_id AND receiver_id = m.sender_id)
                                )
                            ) m ON u.Id = m.user_id 
                        ORDER BY 
                            m.latest_created_at DESC ) as c
                join message on c.message_id = message.Id
                order by message.created_at DESC 
        `,[id, id ,id]);
        return res.render('home',{ user: user, messages:messages});
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

const teamPage = async (req,res) => {
    try {
        if(!req.userId) return res.send('Loi deo gi day');
        const id = req.userId;
        const [reslut] = await pool.query('SELECT * FROM users WHERE Id = ?', [id]);
        const [user] = reslut;
        const [teams] = await pool.query(`
            select t.team_id, teams.Name as team_name, teams.Image as team_img, t.sender_id, u.Name as sender_name, t.content from users as u 
            right join (
                    select t.team_id, m.sender_id, m.content, t.max_time from message_team as m right join 
                ( 
                    select t.team_id, max(m.created_at) as max_time from message_team as m right join
                    ( 
                        select team_id from members where member_id = ?
                    ) as t on m.team_id = t.team_id
                    group by t.team_id
                ) as t on m.team_id = t.team_id and m.created_at = t.max_time
            ) as t on u.Id = t.sender_id
            join teams on t.team_id = teams.Id
            order by t.max_time DESC;
        `,[id]);
         console.log(teams);
        return res.render('team',{ user: user, teams:teams});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const joinTeamPage = async (req,res) => {
    try {
        if(!req.userId) return res.send('Loi deo gi day');
        const id = req.userId;
        const [reslut] = await pool.query('SELECT * FROM users WHERE Id = ?', [id]);
        const [user] = reslut;
    
        return res.render('join',{ user: user});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports = {
    homePage,
    contactPage,
    teamPage,
    joinTeamPage
}