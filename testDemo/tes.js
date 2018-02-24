const student = require("./student");
module.exports = (app) => {
   app.post("/student", (req, res) => {
        var stud = new student({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })

        console.log("start")
        stud.save().then((err) => {
            res.send(err);
        }, stud => {
            res.send(stud);
        })
    })

    app.post("/marks/:stud/:sem", (req, res) => {
        var studMarks=JSON.parse(JSON.stringify(req.body))
        student.findOneAndUpdate({}, {
            $addToSet: {
                semester:studMarks
            }
        }, {new: true}).then((err) => {
            console.log(err)
            res.send(err);
        }, stud => {
            console.log("As")
            res.send(stud);
        })
    })
}