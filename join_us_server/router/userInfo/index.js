const express = require("express")
const userInfoRouter = express.Router()
const query = require('../../utils/mysql')
const {callBackRes} = require('../../utils/callback_res')
//用户信息表

userInfoRouter.get('/user',(req,res)=>{
  callBackRes(res,200,'请求成功',null)
})


module.exports = userInfoRouter