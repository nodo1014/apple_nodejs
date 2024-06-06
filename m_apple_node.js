const express = require('express');
const app = express();
// Express 4.16 이상은 body-parser포함
app.use(express.json());
app.use(express.urlencoded({extended: false}));
const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs'); // res.render('list.ejs')
app.set('views', './views');
app.use('/public', express.static('public'))

//(폼에서 PUT, DELETE 요청 가능케함) npm install method-override 
// <form action="/edit?_method=PUT" method="POST">
const methodOverride = require('method-override')
app.use(methodOverride('_method'))

// 로그인 npm install passport passport-local express-session
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
// passport 가 제공하는 미들웨어
app.use(session({secret : '비밀코드', resave : true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
// process.env.DB_URL / PORT
require('dotenv').config()