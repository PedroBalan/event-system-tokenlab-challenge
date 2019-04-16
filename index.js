const express = require("express");
const consign = require("consign");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var path = require('path');


let app = express();

app.use(bodyParser.urlencoded({extended: false})); 
app.use(bodyParser.json());
app.use(expressValidator());
app.use(express.static("public"));
app.use(cookieParser());
app.use(session({
    key: "user_sid",
    secret: "ultramegasecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

consign().include("routes").include("utils").into(app);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.listen(3000, "127.0.0.1", ()=>{
    console.log("Servidor Rodando");
});