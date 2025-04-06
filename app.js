const Express= require("express")
const Mongoose = require("mongoose")
const Cors = require("cors")
const Bcrypt =require("bcrypt")
const Jwt = require("jsonwebtoken")

let app= Express()

app.get("/",(req,res)=>{
res.send("hello")
})

app.listen(3030,()=>{
    console.log("Server Started")
})