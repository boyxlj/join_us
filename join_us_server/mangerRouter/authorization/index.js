const authorizationRouter = require('express').Router()
const jwt = require('../../utils/jsonwebtoken')

const arr = [
  '/manger/positionTypes/show',
  '/manger/industrys/show',
  '/manger/category',
]
authorizationRouter.use((req,res,next)=>{
  if(req.path.includes("/login")){
    return next()
  }
  if(arr.includes(req.path)){
    return next()
  }
  const mangerToken = req.headers.authorization
  if(mangerToken){
    const payload = jwt.verifyToken(mangerToken)
    if(payload){
      const {username,password} = payload
      const mangerToken = jwt.sendToken({username,password},`${60*30}s`)
      // const mangerToken = jwt.sendToken({username,password},`${60*30}s`)
      res.setHeader("authorization",mangerToken)
      res.header("Access-Control-Expose-Headers","authorization")
      
      return  next()
    }else{
      return res.send({ code: 401, msg: "无效token" })
    }
  }else{
   return next()
  }
})


module.exports = authorizationRouter