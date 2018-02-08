/**
 * routes/routeTask.js
 * tasks end point
 * */

const {Task} = require('./../model/modelTask');

module.exports = (app) => {
    /**
     * POST /task/app
     * @param {String} title title of a task
     * @param {String} description description of task
     * @param {user} user user_id which specify task for particular user
     * */
    app.post('/task/add',(req,res)=>{
       let task=new Task({
           title:req.body.title,
           description:req.body.description,
           user:req.body.user
       })

        task.save().then(task=>{
            res.status(201).send({
                error:false,
                message:"success",
                task:task
            })
        },err=>{
            res.status(400).send({error:true,message:"fail to create "+err})
        })
    });
}