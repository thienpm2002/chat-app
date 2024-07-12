const userRouter = require('./user.router.js');
const pageRouter = require('./page.js');
const friendRouter = require('./friend.router.js');
const chatRouter = require('./chat.router.js');
const teamRouter = require('./team.router.js');
module.exports = (app) => {
     app.use('/',pageRouter);
     app.use('/',userRouter);
     app.use('/',friendRouter);
     app.use('/',chatRouter);
     app.use('/',teamRouter);
}