const express = require("express")
const positionRouter = express.Router()
const query = require('../../utils/mysql')
//职位信息表

positionRouter.get('/',(req,res)=>{
  res.send({code:200,msg:'ok'})
})


module.exports = positionRouter