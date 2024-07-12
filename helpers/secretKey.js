const crypto = require('crypto');


// const accessTokenKey = crypto.randomBytes(32).toString('hex');
// const refeshTokenKey = crypto.randomBytes(32).toString('hex');


// // console.table({accessTokenKey,refeshTokenKey})

const randomCodeTeam = (length)=>{
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length).toUpperCase();
};

module.exports = randomCodeTeam