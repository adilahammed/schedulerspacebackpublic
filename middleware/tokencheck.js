const jwt=require('jsonwebtoken')
privatekey=process.env.api_key
const multer=require('multer')


const tokencheck=async (req,res,next)=>{
    let token="" 
    // console.log(req.method);
    // console.log(req.body);

    if(req.method==="POST"){
        token=req.body.token
        // console.log(token);
    }else if(req.method==="GET"){
        // console.log(req.query);
        token=req.query.token
    }
    try{
        let decoded=await jwt.verify(token,privatekey)
        console.log("verification succes");
        req.id=decoded.id
        next()
    
    }
    catch(err){
        console.log(err);
        res.json({status:"error",message:"token varification failed"})
        res.end()
    }
}


module.exports=tokencheck