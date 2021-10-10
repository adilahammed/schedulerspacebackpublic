const express=require('express')
const multer=require('multer')
const jwt=require('jsonwebtoken')
const usersDB=require('../models/users')
// const decode = require('jsonwebtoken/decode')
const route=express.Router()


privatekey=process.env.api_key


const storage= multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/images/')
    },
    filename:function(req,file,cb){
        if(file.mimetype==="image/jpeg"){
            cb(null,req.id+".jpg")
        }else if(file.mimetype==="image/png"){
            cb(null,req.id+".PNG")

        }
    }
})

const fileFilter=(req,file,cb)=>{
   console.log(file);
    if(file.mimetype==='image/jpeg' || file.mimetype==='image/png'){
        cb(null,true)
    }
    else{
        console.log("kkk");
        (null,false)
    }
}

const upload=multer({storage:storage,
    fileFilter:fileFilter
})

const tokencheck=(req,res,next)=>{
    token=req.headers.authorization
    token=token.slice(7)
    console.log(token);
    try{
        let decoded=jwt.verify(token,privatekey)
        req.id=decoded.id
        console.log(decoded);
        next()
    }catch(err){
        res.json({status:"error",message:"authorization cancel"})
    }
}

route.post('/image',tokencheck,upload.single('productImage'),async (req,res)=>{
    const userDBreult= await usersDB.updateOne({_id:req.id},{$set:{picture:req.file.filename}})
    console.log(userDBreult);
    res.json({status:"ok",message:"upload success"})

})



module.exports=route