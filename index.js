const  mongoose = require("mongoose");
mongoose.connect("mongodb+srv://ostap:VeZHDoigD7dJ5fle@cluster0.xqymk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

const express = require("express");
const app = express();

//for user route
const userRoute = require('./routes/userRoute');
app.use('/', userRoute);



app.listen(3000,function(){
    console.log("Server is running... ");
});
