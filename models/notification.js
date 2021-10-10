const mongoose=require('mongoose')

const notificationSchema= new mongoose.Schema({
    _id:{},
    acceptingmsg:Array
})

const notification=mongoose.model('notification',notificationSchema)

module.exports=notification