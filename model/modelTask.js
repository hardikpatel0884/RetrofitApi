/**
 * model/modelTask.js
 * task specification
 * CreatedAt: 22/01/2018 10:48 PM
 * Author: Hardik Patel
 */

const mongoose = require('mongoose');

const schemaTask = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        maxLength: 100
    },
    image: {
        type:String,
        default:"task.png"
    },
    user: {
        type: mongoose.Schema.ObjectId
    }
});

const Task = mongoose.model('Task', schemaTask);
module.exports = {Task}
