const mongoose = require('mongoose')

const emailOpenSchema = new mongoose.Schema({
    
    from:{
        type:String,
        required:false
    },
    html:{
        type:String,
        required:false
    },
    to:{
        type:String,
        required:false
    },
    status:{
        type:String,
        enum:["new" , "opened" , "reopened"],
        default:"new"
    },
    subject:{
        type:String,
        required:false
    },
    email:{
        type:String,
        required:false
    },
    openedAt:{
        type:Date,
        required:false
    },
    viewCount:{
        type:Number,
        default: 0,
        required:false
    }
},
{
    timeStamp:true
}
)

const EmailOpen = mongoose.model('EmailOpen',emailOpenSchema)
module.exports = EmailOpen