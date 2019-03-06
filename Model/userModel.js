var mongoose = require("mongoose")

var users = mongoose.Schema({
    id: String,
    name : {type:String, required:true},
    password : {type:String, required:true},
    email : { type:String, required: true },
    apis : {type:Array, required:false }
})

module.exports = mongoose.model( "user", users )
