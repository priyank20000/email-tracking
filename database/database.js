const mongoose  = require("mongoose");

async function server(){
    await mongoose.connect("mongodb+srv://priyankdarji87:AlZTbe9XXxttgouf@cluster0.dsyaiz2.mongodb.net/")
}

module.exports = server;
server();
