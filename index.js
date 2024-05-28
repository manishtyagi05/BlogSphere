const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const {checkForAuthenticationCookie} = require("./middleware/auth")
const {connectToMongoDB} = require('./connection');

const Blog = require('./models/blog');


const userRoute = require('./routes/user');


const blogRoute = require('./routes/blog');

const app = express();
const PORT = 8000;



connectToMongoDB("mongodb://127.0.0.1:27017/blogify")
.then(()=> console.log("database connected"));


app.set('view engine', 'ejs');
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/images', express.static('images'));

app.get('/', async (req,res)=>{
 const allBlogs = await Blog.find({});
    res.render("home",{
      
        user: req.user,
        blogs: allBlogs,
    });
  
});
app.use('/user',userRoute);
app.use("/blog",  blogRoute);



app.listen(PORT, ()=>{
    console.log(`App is running on port : ${PORT}`);
})