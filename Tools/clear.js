//delete all devwallet data

var users = require("./model.js")
var apis = require("./apiModel.js")
var mongoose = require("mongoose")

mongoose.connect("mongodb://localhost/devwallet")

users.deleteMany((err) => {
    if(!err)
    console.log("deleted contents, \n resp :")
})

apis.deleteMany((err,resp) => {
    if(!err)
    console.log("deleted contents, \n resp :")
})