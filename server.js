const express = require('express');
const app = express();
const cookie = require('cookie');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');



require('dotenv').config();
// app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
const posts =[
    {
      username : 'vaibhav',
      title : 'goat',
      pass : '1234'
    },
    {
        username : 'shivang',
        title : 'goat 2',
        pass : '5678'

    }
]

app.get('/login',(req,res)=>{
    res.render('index')
})

app.post('/login' , (req,res) =>{
    //authentication started

    console.log(req.body);
    const username = req.body.username ;
    const titles = req.body.title;
    const user = {name : username , title : titles};
    const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET);
    console.log(accessToken);
    res.cookie('token',accessToken);
    // res.json({accessToken :accessToken})
    res.redirect('/posts')



    // res.send('hello in the page ...')
})



app.get('/posts',authentication,(req,res) => {
    
    res.json(posts.filter(ele => ele.username === req.user.name && ele.title === req.user.title  ))
    // res.send('hello')

    
})

function authentication(req,res,next){
    const token = req.cookies.token; // Get the token from cookies
    if (token == null) return res.sendStatus(401); // If no token, return 401

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // If token is invalid, return 403
        req.user = user;
        next();
    });
}



const port = 3000
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});
