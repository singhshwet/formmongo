var mongoose = require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose")
mongoose.connect("mongodb+srv://swta120299:swta120299@oauth-cluster.1mcdkkm.mongodb.net/?retryWrites=true&w=majority");

var  userSchema=mongoose.Schema({
  username:String,
  email:String,
  likes:{
    default:[],
    type:Array
  },
  password:String,
  photo:String
})
userSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model("user",userSchema);
