const express=require('express')
const jwt=require('jsonwebtoken')
privatekey=process.env.api_key
const route=express.Router()
const usersDB=require("../models/users")
const appointmentDB=require("../models/appointmentDB")
const users = require('../models/users')
const { db } = require('../models/users')
route.get('/personalinfo',async (req,res)=>{
    const token=req.query.token
    try{
        var decoded= await jwt.verify(token,privatekey)
        console.log(decoded);
        let dbresult= await usersDB.findById({_id:decoded.id})
        let userinfo={
            id:dbresult._id,
            username:dbresult.username,
            email:dbresult.email,
            picture:dbresult.picture
        }
        res.json({status:"ok",userinfo})
    }catch(err){
        console.log(err);
    }
})
route.post('/apposetusers',async(req,res)=>{
    console.log("==="+req.id);
    try{
        const dbresult= await appointmentDB.find({$and:[{setappo:true},{_id:{$ne:req.id}}]},{id:1})
        let dbresultuser= await users.find({_id:dbresult},{_id:1,username:1,email:1,picture:1,description:1})
        
        console.log(dbresult);
        res.json({status:"ok",message:{dbresultuser}})
    }catch(err){
        res.json({status:"error",message:err})
        console.log(err);
    }
})

route.get('/search',async(req,res)=>{
    const {token,text}=req.query
    let user= jwt.verify(token,privatekey)
    console.log(text);
    if(text===""){
        try{
            const dbresult= await appointmentDB.find({$and:[{setappo:true},{_id:{$ne:req.id}}]},{id:1})
            let dbresultuser= await users.find({_id:dbresult},{_id:1,username:1,email:1,picture:1,description:1})
            
            console.log(dbresultuser);
            res.json({status:"ok",users:dbresultuser})
        }catch(err){
            res.json({status:"error",message:err})
            console.log(err);
        }
    }
    else{
        usersDB.find({$or:[{username:{$regex:text}},{email:{$regex:text}}]},{_id:1,username:1,email:1,picture:1,description:1})
        .then((result)=>{
            console.log(result);
            res.json({status:"ok",users:result})
        }).catch((err)=>{
            res.json({status:"error",message:err})
        })
    }
})

route.get('/viewuser',(req,res)=>{
    // console.log(req.query.name);
    const {token,name}=req.query
    users.findOne({username:name},{_id:0,username:1,email:1,picture:1,description:1})
    .then((result)=>{
        console.log(result);
        res.json({status:"ok",userinfo:result})
    }).catch((err)=>{
        console.log(err);
    })
})

module.exports=route