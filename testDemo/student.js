const mongoose = require('mongoose');

const scheemaStudent = new mongoose.Schema({
    name:{
        type:String
    },
    enrollment:{
        type:String
    },
    password:{
        type:String
    },
    semester:{
        type:Array,
        default:null
    }
});

module.exports = mongoose.model('Student', scheemaStudent);