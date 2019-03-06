var mongoose = require("mongoose")

var apiSchema = mongoose.Schema({
    title:String,
    password:String,
    apiKey:String,
    secret:String,
    date:Date,
    user:{type:String, ref:"user"}
})


module.exports =  mongoose.model("api",apiSchema)
