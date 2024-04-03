const mongoose = require('mongoose');

const apiSchema = new mongoose.Schema({
    email:String,
    username:String,
    password:String,
    phonenumber:String,
    address:String,
    filename: {
        type: String,
    },
    admin:{
        type:Boolean
    }
    
});

  
module.exports = mongoose.model('user',apiSchema);

