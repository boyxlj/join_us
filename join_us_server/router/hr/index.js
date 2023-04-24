const express = require("express")
const hrRouter = express.Router()
const query = require('../../utils/mysql')
//人事表

hrRouter.get('/',(req,res)=>{
  res.send({code:200,msg:'ok'})
})


module.exports = hrRouter