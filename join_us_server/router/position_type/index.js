const express = require("express")
const positionTypeRouter = express.Router()
const query = require('../../utils/mysql')
//职位类型表

positionTypeRouter.get('/',(req,res)=>{
  res.send({code:200,msg:'ok'})
})


module.exports = positionTypeRouter