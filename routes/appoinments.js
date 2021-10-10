const express=require('express')
const route=express.Router()
const appointmentDB=require('../models/appointmentDB')
const usersDB=require('../models/users')
const notificationDB=require('../models/notification')
const jwt=require('jsonwebtoken')
// const appointments = require('../models/appointmentDB')
const { db } = require('../models/users')

privatekey=process.env.api_key

route.post('/setappo',async (req,res)=>{
    const{token,setappo,slotes}=req.body

    try{
        var decoded= await jwt.verify(token,privatekey)
        console.log("###",decoded);
        let a=[]
        let b=slotes.length
        while(b>0){
            a.push([])
            b=b-1
        }
        if(setappo===true){
            var result=await appointmentDB.create({
                _id:decoded.id,
                setappo:setappo,
                slotes:slotes,
                apporequest:a

            })
            console.log(result);
        }
        console.log(decoded);
    }
    catch(err){
        console.log(err);
    }
    res.json({status:"ok",message:"suucess"})
})
route.post('/sendreq',async (req,res)=>{
    const {token,rec_id,sloteno}=req.body
    let result=jwt.verify(token,privatekey)
    let same=false
    console.log("****");
    console.log(req.body);
    
    try{
        let resultdb= await appointmentDB.findById(rec_id)
        console.log(resultdb);
        
        resultdb.apporequest[sloteno].map((val)=>{
            if(val===result.id){
                same=true
                console.log("%%%");
            }
        })
        if(same===false){
            resultdb.apporequest[sloteno].push(result.id)
            let upresult= await appointmentDB.updateOne({_id:rec_id},{$set:{apporequest:resultdb.apporequest}})
            console.log(upresult)
            res.json({status:"ok",message:"request send succes"})
        }else{
            res.json({status:"error",message:"alreade request send"})
            res.end()
        }
    }
    catch(err){
        console.log(err);
    }

})

route.get('/viewreq',async(req,res)=>{
    const {token}=req.query
    const account=jwt.verify(token,privatekey)
    // console.log(account);
    let sendname=[0]
    let reqid=[]
    let reqname=[]
    let sendslote
    try{
        appointmentDB.findById(account.id,{apporequest:1,slotes:1})
        .then((dbresult)=>{
            console.log(dbresult.apporequest);
            dbresult.apporequest.map(async(a,i)=>{
                a.map((b)=>{
                    reqid.push(b)
                })
            })
        console.log(reqid);
        usersDB.find({_id:reqid},{id:1,username:1})
        .then((resp)=>{
            reqid.map((a)=>{
                resp.map((b)=>{                   
                    if(b._id.toString()===a){
                        reqname.push(b.username)
                    }
                })
            })
            let reqarr=dbresult.apporequest
            dbresult.apporequest.map((a,q)=>{
                a.map((b,w)=>{
                    reqid.map((c,i)=>{
                        if(b===c){
                            reqarr[q][w]=reqname[i]
                        }
                    })
                })
            })
            console.log(reqarr);       
            res.json({status:"ok",message:{slotes:dbresult.slotes,names:reqarr}})
            

        }).catch((err)=>{
            console.log(err);
            res.json({status:"errrrror",message:err})

        })

        })
     
    }catch(err){
        res.json({status:"error",message:err})
        console.log(err);
    }
})

route.post('/accept',async(req,res)=>{

    const {token,accid,sloteno,nameno}=req.body
    let same=false
    let newreq=[]
    console.log(accid,sloteno,nameno);
    account=jwt.verify(token,privatekey)
    try{
        let dbresult=await appointmentDB.findById(account.id,{apporequest:1,accepted:1,slotes:1})
        console.log(dbresult);
        dbresult.apporequest[sloteno].splice(nameno,1)
        console.log(sloteno);
        dbresult.accepted[sloteno]=accid
        // dbresult.accepted.push(accid)
        let updateresult= await appointmentDB.updateMany({_id:account.id},{apporequest:dbresult.apporequest,accepted:dbresult.accepted})
        res.json({status:"ok"})
        let name=await usersDB.findById(account.id,{_id:0,username:1})
        let notstring=`${name.username} is accepted your request for ${dbresult.slotes[sloteno]}`
        const userresult= await usersDB.findOne({username:accid},{_id:1})
        console.log(userresult._id.toString());

        notificationDB.create({_id:userresult._id.toString(),
            acceptingmsg:notstring}).then((notres)=>{
                console.log(notres);
            }).catch((err)=>{
                if(err.code===11000){
                    notificationDB.updateOne({_id:userresult._id.toString()},{$push:{acceptingmsg:notstring}})
                    .then((notupresult)=>{
                        console.log(notupresult);
                    })
                }
                // console.log(err.code);
            })

        console.log(updateresult);
    }catch(err){
        res.json({status:"error"})
        console.log(err);
    }


})

route.get('/slotes',async (req,res)=>{
    
    try{
        const sloteresult= await appointmentDB.findById(req.query.id,{slotes:1})
        console.log("=="+sloteresult);
        if(sloteresult===null){
            return res.json({status:"noslote",message:"appointment not assigned"})
             
        }
        res.json({status:"ok",message:sloteresult})
        console.log(req.query.id);
    }catch(err){
        console.log("====");
        console.log(err);
        res.json({status:"error",message:err})
    }
})

route.post('/deleteslote',(req,res)=>{
    user=jwt.verify(req.body.token,privatekey)
    appointmentDB.deleteOne({_id:user.id})
    .then((result)=>{
        console.log(result);
    })
    console.log(user);
})

module.exports=route


