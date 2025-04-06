const Express = require("express")
const Mongoose = require("mongoose")
const Cors = require("cors")
const Bcrypt = require("bcrypt")
const Jwt = require("jsonwebtoken")
const userModel = require("./models/users")

let app = Express()


app.use(Cors())
app.use(Express.json())

Mongoose.connect("mongodb+srv://a1r2j3u4n5:a1r2j3u4n5@cluster0.ck7ta.mongodb.net/blogAppDb?retryWrites=true&w=majority&appName=Cluster0")
//sign in

app.post("/signIn", async (req, res) => {

    let input = req.body
    let result = userModel.find({ email: req.body.email }).then(
        (items) => {
            if (items.length > 0) {

                const passwordValidator = Bcrypt.compareSync(req.body.password,items[0].password)
                if (passwordValidator) {
                    Jwt.sign({email:req.body.email},"BlogApp",{expiresIn:"1d"},
                        (error,token)=>{
                            if (error) {
                                res.json({"status":"error","errorMessage":error})
                            } else {
                                res.json({"status":"success","token":token,"userId":items[0]._id})

                            }
                        })


                } else {
                    res.json({ "status": "incorrect password" })
                }


            } else {
                res.json({ "status": "invalid id" })
            }
        }



    ).catch(

    )



})










// signup
app.post("/signup", async (req, res) => {

    let input = req.body
    let hashedPassword = Bcrypt.hashSync(req.body.password, 10)
    console.log(hashedPassword)
    req.body.password = hashedPassword

    userModel.find({ email: req.body.email }).then(
        (items) => {

            if (items.length > 0) {

                res.json({ "status": "email id allredy exist" })

            } else {

                let result = new userModel(input)
                result.save()
                res.json({ "status": "Success" })

            }

        }

    ).catch(
        (error) => { }

    )



})

app.listen(3030, () => {
    console.log("Server Started")
})