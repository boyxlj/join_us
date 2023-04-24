const express = require("express")
const companyRouter = express.Router()
const query = require('../../utils/mysql')
//公司表

companyRouter.get('/',(req,res)=>{
  res.send({code:200,msg:'ok'})
})


module.exports = companyRouter