const mongoose=require('mongoose')


const appointmentschema= new mongoose.Schema({
    _id:{},
    setappo:{type:Boolean},
    apporequest:{type:Array},
    accepted:{type:Array},
    slotes:{type:Array}
})

const appointments=mongoose.model("appointments",appointmentschema)

module.exports=appointments