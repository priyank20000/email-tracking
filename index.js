const express = require('express')

const dotenv = require('dotenv')
const server = require('./database/database')
const path = require('path');
const router = require('./router/emailRouter');
const bodyParser = require('body-parser');

dotenv.config({path:".env"})
const app = express()
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use(router)


server().then(()=>{
    console.log("Database Connect Successfully");
}).catch(err=>{
    console.log(err);
})



app.listen(process.env.PORT,()=>{
    console.log("Port Connected");
})
