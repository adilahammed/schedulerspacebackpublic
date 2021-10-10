const express=require('express')
const jwt=require('jsonwebtoken')
const route=express.Router()
const notificationDB=require('../models/notification')
const appointmentDB=require('../models/appointmentDB')
privatekey=process.env.api_key



route.get('/',(req,res)=>{
    user=jwt.verify(req.query.token,privatekey)
    notificationDB.findById(user.id,{_id:0,acceptingmsg:1})
    .then((result)=>{
        // console.log(result.acceptingmsg.reverse());
        res.json({status:"ok",notifications:result.acceptingmsg})
    })
    .catch((err)=>{
        console.log(err);
        res.json({status:"error",msg:"error occured"})

    })
    // console.log(user);
})

route.get('/schedules',(req,res)=>{
    user=jwt.verify(req.query.token,privatekey)
    // console.log(user);
    appointmentDB.findById(user.id,{slotes:1,accepted:1})
    .then((result)=>{
        let schedulestr=[]
        result.accepted.map((a,i)=>{
            schedulestr.push(`${result.slotes[i]}:${a}`)
        })
        res.json({status:"ok",schedules:schedulestr})
        console.log(schedulestr);
    })
    .catch((err)=>{
        console.log(err);
        res.json({status:"error"})
    })
})


module.exports=route