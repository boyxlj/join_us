const authorizationRouter = require('express').Router()
const jwt = require('../../utils/jsonwebtoken')

const arr = [
  '/positionType',
  '/position/hot',
  '/positionType',
  '/position/by/rand',
  '/swipers',
  '/industrys',
  '/industrys',
  '/position/hotSearch',
  '/positions',
  '/companys',
  '/companyInfo',
  '/user/login',
  '/manger/login',
  '/company/positions',
  '/category',
  '/hr/LoginOrRegister',
]
authorizationRouter.use((req, res, next) => {
  if (arr.some((item)=>item.includes(req.path))) {
    return next()
  }
  if (arr.includes(req.path)) {
    return next()
  }
    if(req.url.indexOf("/static/upload")!=-1){
    return  next()
  }
  const token = req.headers.authorization
  const companyToken = req.headers.authorizations
  if (token) {
    const payload = jwt.verifyToken(token)
    if (payload) {
      const { email } = payload
      const token = jwt.sendToken({ email }, `3day`)
      res.setHeader("authorization", token)
      res.header("Access-Control-Expose-Headers", "authorization")
      return next()
    } else {
      return res.send({ code: 401, msg: "无效token" })
    }
  }

  if (companyToken) {
    const payload = jwt.verifyToken(companyToken)
    if (payload) {
      const { telephone } = payload
      const companyToken = jwt.sendToken({ telephone }, `1day`)
      res.setHeader("authorizations", companyToken)
      res.header("Access-Control-Expose-Headers", "authorizations")
       next()
    } else {
      return res.send({ code: 401, msg: "无效token" })
    }
  } 
  
  if(!companyToken && !token) {
    // return res.send({ code: 401, msg: "无效token" })
    return next()
  }
})


module.exports = authorizationRouter