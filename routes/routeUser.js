/**
 * routes/routeUser.js
 * user endpoint containing user operations
 * CreatedAt: 26/01/2018 4:12 PM
 * Author: Hardik Patel
 * */
const {User} = require('./../model/modelUser'),
fs=require('fs');
module.exports = (app, passport) => {
    /**
     * GET /user/register
     * get register view
     * */
    app.get('/user/register', (req, res) => {
        res.render('userRegister.hbs');
    });

    /**
     * POST /user/register
     * register user
     * */
    app.post('/user/register', (req, res) => {
        let image =Date.now() + ".jpeg";
        let imagePath="./image/user/"+image;
        var isUpload=true;
        if(req.body.image){
            fs.writeFile(imagePath, new Buffer(req.body.image, "base64"), (err) => {
                if (err) {
                    console.log("in error : ",err)
                    isUpload=false;
                }
            });
        }else{
            image="user.png"
        }

        let user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            image:image
        });
        console.log("user ready: ",user)
        if (isUpload) {
            user.save().then((user) => {
                console.log(user)
                res.set("apiKey", user.apiKey).status(201).send({
                    "Register": {
                        "error": false,
                        "message": "success",
                        "user": {"name": user.name, "email": user.email, "image":user.image}
                    }

                });
            }, (e) => {
                console.log(e)
                res.status(200).send({Register: {error: true, message: "fail to register " + e}});
                // res.render('userRegister.hbs',{'error':e.toString()});
            })
        }else{
            res.status(200).send({Register: {error: true, message: "fail to register " + e}});
        }
    });

    /**
     * GET /user/login
     * get login view
     * */
    app.get('/user/login', (req, res) => {
        res.render('userLogin.hbs');
    });

    /**
     * POST /user/login
     * user login
     * */
    app.post('/user/login', passport.authenticate('local', {
        failureRedirect: '/user/loginfail',
    }),(req,res)=>{
        res.set("apiKey", req.session.passport.user.apiKey).status(200).send({
            Login: {
                error: false,
                message: "success",
                user: {
                    "name": req.session.passport.user.name,
                    "email": req.session.passport.user.email,
                    "image": req.session.passport.user.image
                }
            }
        });
    });

    /**
     * GET /user/loginfail
     * when authentication fails
     * */
    app.get('/user/loginfail', (req, res) => {
        console.log("failed")
        res.status(200).send({Login: {error: true, message: "login fail"}});
        // res.render('userLogin.hbs',{error:"enter valid username or password"})
    })

    /**
     * PUT /user/image
     * */
    app.put('/user/image', (req, res) => {
        if (req.body.image) {
            let image =`${req.user.name}_${Date.now}.jpeg`;
            console.log("image name ",image);
            let imagePath="./../image/user/"+image;
            fs.writeFile(imagePath, new Buffer(req.body.image, "base64"), (err) => {
                if (err) {
                    res.send(err)
                }
            });
            User.findOneAndUpdate({id: req.user.id}, {$set: {image: image}}, {new: true}, (err, user) => {
                if (err) {
                    res.status(200).send({error: true, message: "image unable updated"})
                }
                res.status(200).send({error: false, message: "image updated", image: user.image});
            });
        } else {
            res.status(400).send({error: true, message: "no image found"});
        }
    })

    /**
     * PUT /user/update
     * update user details
     * */
    app.put('/user/update',(req,res)=>{
        console.log("Start update : ",req.body.name)
        console.log("id: ",req.user.id)
        User.findOneAndUpdate({_id:req.user.id},{$set:{name:req.body.name}},{new:true},(err,user)=>{
            if(err || !user){
                res.status(200).send({error:true,message:"unable to update"})
            }else{
                res.status(200).send({error:false,message:"updated",user:{user}})
            }
        })
    });

    /**
     * GET /user/logout
     * logout user
     * */
    app.get('/user/logout', (req, res) => {
        req.session.destroy((err) => {
            console.log(err)
        })
        res.render('userLogin.hbs')
    })


    /**
     * GET /user/get
     * get list of all user details
     * */
    app.get('/user/get', (req, res) => {
        console.log("start");
        User.find().then(user => {
            res.send({"users": user})
        }, e => {
            console.log("error: "+e)
            res.send({"users":null})
        })
    });

    /**
     * DELETE /user/remove
     * delete user from list
     *
     * */
    app.delete('/user/remove',(req,res)=>{
       console.log("user: ",req.user);
       User.findByIdAndRemove(req.user.id,(err,user)=>{
           if(err){
               console.log("delete error: ",err)
               res.status(200).send({error:true,message:"unable to delete"});
           }else{
               console.log("deleted")
               res.status(200).send({error:false,message:"user deleted"});
           }
       });
    });
};