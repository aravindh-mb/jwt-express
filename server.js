//  requirements
const express = require('express')
const bodyParser =  require('body-parser')
const jwt = require('jsonwebtoken')

const app = express()

// file imports
const cars = require("./cars.json")
const users = require("./users.json")

// middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

// routes
app.post('/log',(req,res)=>{
    const user = users.find((user)=> {
        // console.log(req.body.username)
       return (user.username === req.body.username)
    })
    if(user){
        if(user.password === req.body.password){
            console.log(user.id)
            const token = jwt.sign({userID :user.id},"secret")
            res.status(200).send({JWTtoken:token})
        }else{
            res.status(404).send({ message : "Access Denied pass not match" })
        }
    } else{ 
        res.status(401).send({ message : "Access Denied" })
    }
})

function checkToken(req,res,next){
    const token = req.headers["authorization"]
    console.log(token)
    if(token){
        jwt.verify(token,"secret",(err,decoded)=>{
            console.log("decoded msg : ",decoded)
            if(err)  res.status(401).send({message : "Access Denied" })

            else{
                req.userID = decoded.userID
                next()
            }
        })
    } else res.status(401).send({ message : "Access Denied" })
}

app.get("/data",checkToken,(req,res)=>{
    console.log(req.userid)
    const filtered = cars.filter((car,index,array)=>{
            return (car.userid === req.userID)
    })
    res.status(201).send({ data : filtered })
})

// base route
app.get((rq,rs)=>{
    rs.send("<h1>Initial page</h1>")
})

// server listen
app.listen(3000,()=> console.log("app is listen in 3000 port"))
