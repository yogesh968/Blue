const express=require('express')
const { prisma } = require('./db/config.js');
const app=express()

app.use(express.json())










app.listen(PORT,()=>{
    console.log('SERVER HAS STARTED AND LISTENING ON '+PORT)
})
module.exports = { app, prisma };