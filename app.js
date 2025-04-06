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


app.post("/signup", async (req, res) => {

    let input = req.body
    let hashedPassword = Bcrypt.hashSync(req.body.password, 10)
    console.log(hashedPassword)
    req.body.password = hashedPassword

     userModel.find({ email: req.body.email }).then(
        (items)=>{

            if (items.length>0) {

                res.json({"status":"email id allredy exist"})
                
            } else {
    
                let result = new userModel(input)
                  result.save()
                 res.json({"status":"Success"})
                
            }

        }

     ).catch(
        (error)=>{}

     )

    

})

app.listen(3030, () => {
    console.log("Server Started")
})