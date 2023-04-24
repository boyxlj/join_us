const express = require("express")
const collectRouter = express.Router()
const query = require('../../utils/mysql')
//收藏表

collectRouter.get('/',(req,res)=>{
  res.send({code:200,msg:'ok'})
})


module.exports = collectRouter