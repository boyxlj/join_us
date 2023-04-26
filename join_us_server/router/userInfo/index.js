const express = require("express")
const userInfoRouter = express.Router()
const query = require('../../utils/mysql')
const { callBackRes } = require('../../utils/callback_res')
const { getRandomCoder } = require("../../utils/getRandomCoder")
const { sendEmail } = require("../../utils/nodeMailer")
const { returnErr } = require("../../utils/returnErr")
const jwt  = require('../../utils/jsonwebtoken')
const { v4:uuidv4  } = require('uuid');
let saveCode = '111111'
//用户登录 validate_code email
userInfoRouter.post('/user/login', (req, res) => {
  const { email, validateCode } = req.body
  const reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
  if (!email || !reg.test(email)) return returnErr(res, '邮箱不合法')
  if (!validateCode || validateCode.length !== 6) return returnErr(res, '验证码不合法')
  if (validateCode !== saveCode) return returnErr(res, '验证码有误',402)
  const selectSql = `select * from userinfo where email = '${email}'`
  const insertSql = `insert into userinfo(email,userId) values('${email}','${uuidv4()}') `
  const userIdSql = `select * from userinfo where email = '${email}'`
  query(selectSql, (selectSqlRes) => {
    if (!selectSqlRes.length) {
      //注册
      query(insertSql, (insertRes) => {
        if (insertRes.affectedRows < 1) return returnErr(res, '登录失败') 
        query(userIdSql,(userIdRes)=>{
          if(!userIdRes.length)  return returnErr(res, '登录失败')
          res.status(200).send({ code: 200, msg: '登录成功', data: null,userInfo:userIdRes,token:jwt.sendToken({email},'1day')})
        })
      })
    } else {
      //登录
      res.status(200).send({ code: 200, msg: '登录成功', data: null,userInfo:selectSqlRes, token:jwt.sendToken({email},'1day') })
    }
  })
})


//发送验证码  email
userInfoRouter.post('/user/email/coder', (req, res) => {
  const coder = getRandomCoder()
  const { email } = req.body
  if (coder.length !== 6) return returnErr(res)
  saveCode = coder
  const reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
  if (!email || !reg.test(email)) return returnErr(res, '邮箱不合法')
  sendEmail(email, coder).then(result => {
    return res.status(200).send({ code: 200, msg: "验证码发送成功", validateCode: coder })
  }, err => {
    return returnErr(res, '验证码发送失败')
  })

})


//获取用户信息
userInfoRouter.get('/user', (req, res) => {
  const {userId} =req.query
  const sql = `select * from userinfo where userId = '${userId}'`
  // query('')
})




module.exports = userInfoRouter