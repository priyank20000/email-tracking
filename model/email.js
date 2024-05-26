const mongoose = require('mongoose')

const emailSchema = new mongoose.Schema({
    from:{
        type:String,
        required:false
    },
    to:{
        type:String,
        required:false
    },
    html:{
        type:String,
        required:false
    },
    status:{
        type:String,
        enum:["New" , "opened" , "reopened"],
        default:"New"
    },
    subject:{
        type:String,
        required:false
    }
},
{
    timeStamp:true
}
)

const email = mongoose.model('email',emailSchema)
module.exports = email