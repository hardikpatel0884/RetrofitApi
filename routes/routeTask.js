/**
 * routes/routeTask.js
 * tasks end point
 * */

const {Task} = require('./../model/modelTask'),
    fs = require('fs');

module.exports = (app) => {
    /**
     * POST /task/app
     * @param {String} title title of a task
     * @param {String} description description of task
     * @param {user} user user_id which specify task for particular user
     * */
    app.post('/task/add', (req, res) => {
        let task = new Task({
            title: req.body.title,
            description: req.body.description,
            user: req.user.id
        })

        task.save().then(task => {
            res.status(201).send({
                error: false,
                message: "success",
                task: task
            })
        }, err => {
            res.status(400).send({error: true, message: "fail to create " + err})
        })
    });

    app.get('/task/get/',(req,res)=>{
        Task.find({user:req.user.id}).then(tasks=>{
            if(!tasks){
                res.status(200).send({error:false,message:"no task found",task:null})
            }else{
                res.status(200).send({error:false,message:"success",task:{tasks}})
            }
        },err=>{
            res.status(400).send({error:true,message:err.toString()})
        })
    })
}