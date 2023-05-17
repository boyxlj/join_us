const express = require("express")
const router = express.Router()
const jwt = require('../utils/jsonwebtoken')

const arr = [
  '/manger/positionTypes/show',
  '/manger/industrys/show',
  '/manger/category'
]
router.use((req,res,next)=>{
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
      const mangerToken = jwt.sendToken({username,password},`${15}s`)
      res.setHeader("authorization",mangerToken)
      res.header("Access-Control-Expose-Headers","authorization")
      
      return  next()
    }else{
      return res.send({ code: 401, msg: "无效token" })
    }
  }else{
   return res.send({ code: 401, msg: "无效token" })
  }
})








//鉴权
// app.use((req, res, next) => {
//   console.log(req.url)
//   if (jwtList.some(item=>req.url==item)) {
//     next()
//     return
//   }
//   if(req.url.indexOf("/public/static")!=-1){
//     next()
//     return
//   }
//   if(req.url.indexOf("/search/tags?")!=-1){
//     next()
//     return
//   }
//   if (req.url.includes("/back/")) {
//     //后台token校验
//     const token = req.headers.authorization
//     if (token) {
//       const payload = jwt.verifyToke(token)
//       if (payload) {
//         const {username,password} = payload
//         const token = jwt.setToken({username,password},`${60*30}s`)
//         res.header("authorization",token)
//         res.header("Access-Control-Expose-Headers","authorization")
//         next()
//       } else {
//         res.send({ code: 4044, msg: "无效token" })
//       }
//     } else {
//       // next()
//       res.send({ code: 4044, msg: "无效token" })
//     }
//   } else {
//     const token = req.headers.authorization
//     if(token){
//       const payload = jwtPre.verifyToken(token)
//       if(payload){
//         const {username,password} = payload
//         const token = jwtPre.setToken({username,password},"3d")
//         res.header("authorization",token)
//         res.header("Access-Control-Expose-Headers","authorization")
//         next()
//       }else{
//         res.send({ code: 4044, msg: "无效token" })
//       }
//     }else{
//       next()
//       // res.send({ code: 4044, msg: "无效token" })
//     }
//   }

// })


//路由中间件-前台



router.use(require("./position_type"))
router.use(require("./company"))
router.use(require("./collect"))
router.use(require("./hr"))
router.use(require("./position"))
router.use(require("./resume"))
router.use(require("./userInfo"))
router.use(require("./send"))
router.use(require("./consult"))
router.use('/upload',require("./upload"))

module.exports = router