const userRouter = require('./user.router.js');
const pageRouter = require('./page.js');


module.exports = (app) => {
     app.use('/',pageRouter);
     app.use('/',userRouter);
}