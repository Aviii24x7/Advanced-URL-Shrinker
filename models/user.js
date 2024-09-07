const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type : String,
        required: true,
    },
    role:{
        type: String,
        required: true,
        default: "NORMAL"
    }
}, { timestamps: true});


const userModel = mongoose.model('userModel', userSchema);

module.exports = userModel;