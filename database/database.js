const mongoose  = require("mongoose");

async function server(){
    await mongoose.connect("mongodb+srv://shubhamzalavadiya6:rG7lPVIFvbzBthTw@cluster0.wvldhni.mongodb.net/")
}

module.exports = server;
server();