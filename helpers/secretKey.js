const crypto = require('crypto');


const accessTokenKey = crypto.randomBytes(32).toString('hex');
const refeshTokenKey = crypto.randomBytes(32).toString('hex');


console.table({accessTokenKey,refeshTokenKey})