const express = require('express');
require('dotenv').config();
const createError = require('http-errors');
const path = require('path');
const router = require('./routers/main.js');
const cookieParser = require('cookie-parser');


const app = express();

// middlewares
app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// Routers
router(app);
// Set error handler
app.use((req,res,next)=>{
      next(createError.NotFound('This router does not a exist.'));
})

app.use((err,req,res,next)=>{
       res.json({
           status: err.status || 500,
           message: err.message
       })
})


// Set template
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));





const port = process.env.PORT || 3000;
app.listen(port, () => {
     console.log(`Server is running on port: ${port}`);
})

