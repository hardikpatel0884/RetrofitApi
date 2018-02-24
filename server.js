/**
 * server.js
 * main file
 * contain allroutes and work flow of application
 * CreatedAt: 22/01/2018
 * Author: Hardik Patel
 */

const express = require('express'),
    bodyParser = require('body-parser'),
    {config} = require('./config/config'),
    {mongoose} = require('./config/dbConnect'),
    {User} = require('./model/modelUser'),
    {Task} = require('./model/modelTask'),
    fs = require('fs'),
    hbs = require('hbs'),
    passport = require('passport'),
    session = require('express-session'),
    fileUpload = require("express-fileupload");

app = express();
app.use(fileUpload());
app.use(session({secret: 'user'}));
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/views/user/'));
app.use(express.static(__dirname + '/image/'));
// app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser({limit: '500mb', extended: true}));
app.use((req, res, next) => {
    let log = `${new Date().toString()} : ${req.method} ${req.url}`;
    fs.appendFile('./server.log', log + "\n");
    console.log("in middleware : ",req.body);
    if (req.url.toString() === "/user/login" || req.url.toString() === "/user/register" || req.url.toString() === "/image/user.*" || req.url.toString() === "/user/loginpass" || req.url.toString() === "/user/loginfail") {
        next();
    } else {
        User.findOne({"apiKey": req.header("apiKey")}).then(user => {
            if (user) {
                req.user = user;
                next();
            } else {
                res.status(401).send({error: true, message: "unauthorized user"});
            }
        })
    }
});
app.use(passport.initialize());
app.use(passport.session());
require('./config/passportLocalAuth')(passport)
require('./routes/routeUser')(app, passport);
require('./routes/routeTask')(app);
require('./testDemo/tes')(app);

/**
 * save image
 * POST /upload
 * @param ${String} image base64 string
 * */
app.post('/upload', (req, res) => {
    console.log("start image")
    var isUpload = true;
    const imagString = req.body.image;
    const imagename = Date.now() + ".jpeg";
    let imagePath = './image/user/' + imagename
    fs.writeFile(imagePath, new Buffer(imagString, "base64"), (err) => {
        if (err) {
            isUpload = false;
            res.send({error: true, message: err})
        }
    });
    if (isUpload) {
        console.log('image:', req.user.id);
        User.findOneAndUpdate({_id: req.user.id}, {image: imagename}, {new: true}, (err, result) => {
            if (err) {
                res.send({error: true, message: "unable to upload image"});
            } else if (result) {
                res.status(200).send({error: false, message: "image uploaded", user: {result}});
            }
        })
    } else {
        res.send({error: true, message: "image can't be uploaded"});
    }
})

/**
 * save video
 * */
app.post("/upload/video", (req, res) => {
    console.log("start video upload : ",req );
    if(!req.files){
        res.send({error:true,message:"no file found"});
    }else{
        const video = req.files.video;
        const name = Date.now() + ".mp4";
        const videoPath = './image/video/' + name;

        video.mv(videoPath,(err)=>{
            if(err){
                res.send({error:true,message:"Unable to upload"})
            }else{
                res.send({error:false,message:"uploaded"})
            }
        })
    }
});

app.listen(config.port, () => {
    console.log(`server listen on port no ${config.port}`)
});