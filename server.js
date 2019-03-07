var express = require("express"),
    http = require("http"),
    bodyParser = require("body-parser"),
    router = require("./router.js")
    path = require("path"),
    cors = require("cors"),
    jwt = require("jsonwebtoken"),
    mongoose = require("mongoose"),
    db = "mongodb:/localhost/devwallet"
    

//cors options
var options = {
origin : "*"
}

// creating the server
var app = new express(),
    server = http.createServer(app)

// App configuration
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use("/",router)
app.use(cors(options))
app.set("view engine", "pug")
app.set("views", "frontend")
app.use(express.static(__dirname))

//establishing connection to mongodb database
mongoose.connect("mongodb://localhost/devwallet").then(function(){console.log("connected to database") })
.catch(function(err) { console.log(err.message)})

//port to listen on
var port = process.env.PORT || 3100

var address = port != process.env.PORT ? "http://localhost:3200" : " " 

server.listen(port, function(){
    console.log("DevWallet : " + address )
})

