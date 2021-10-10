const express=require('express')
const route=express.Router()
const usersDB=require('../models/users')
const jwt=require('jsonwebtoken')

privatekey=process.env.api_key


route.post('/',(req,res)=>{
   
    account=jwt.verify(req.body.token,privatekey)
    desc=req.body.desc
    usersDB.updateOne({_id:account.id},{description:desc})
    .then((result)=>{
        console.log(result);
    })
    
    
})



module.exports=route