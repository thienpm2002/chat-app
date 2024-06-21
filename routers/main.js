const userRouter = require('./user.router.js');
const pageRouter = require('./page.js');
const friendRouter = require('./friend.router.js');

module.exports = (app) => {
     app.use('/',pageRouter);
     app.use('/',userRouter);
     app.use('/',friendRouter);
}