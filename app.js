//library
const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const tokencheck=require('./middleware/tokencheck')
require('dotenv').config()
//router
const register=require('./routes/register')
const appointments=require('./routes/appoinments')
const user=require('./routes/user')
const imageupload=require('./routes/imageupload')
const profile=require('./routes/profile')
const notification=require('./routes/notification')

mongodburl=`mongodb+srv://adil:${process.env.mongodburl}@cluster0.vocpz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`


//mongoose
mongoose.connect(mongodburl).then(()=>{
    console.log('mongoose connected')
}).catch((err)=>{
    console.log(err);
})


const app=express()
const port= process.env.PORT || 9000

//middleware
app.get('/',(req,res)=>{
    res.send("adil")
})
app.use(express.static('public'))
app.use(express.json())
app.use(cors())
app.use('/api',tokencheck)
app.use('/account',register)
app.use('/api/appointment',appointments)
app.use('/api/user',user)
app.use('/api/profile',profile)
app.use('/api/notification',notification)
app.use('/upload',imageupload)




app.listen(port,()=>{
    console.log(port+"running");
})