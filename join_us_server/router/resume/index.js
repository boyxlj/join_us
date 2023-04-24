const express = require("express")
const resumeRouter = express.Router()
const query = require('../../utils/mysql')
//简历表

resumeRouter.get('/',(req,res)=>{
  res.send({code:200,msg:'ok'})
})


module.exports = resumeRouter