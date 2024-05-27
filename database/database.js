const mongoose  = require("mongoose");

async function server(){
    await mongoose.connect(process.env.MON_URL)
}

module.exports = server;
server();