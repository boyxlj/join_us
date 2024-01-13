const express = require('express')
const cors = require('cors')
const {resolve} = require('path')
const app = express()
app.use(cors())
app.use(express.urlencoded({extended:false}))
app.use(express.json())
// const AllowOriginList = [
//       'http://zhaopin.helloxlj.top','http://small-zhaopin.helloxlj.top'
// ]
// const publicApiList = [ '/static/upload']  
// app.all("*", (req, res, next) => {
// if (req.url.includes( '/static/upload')) {
//   res.header("Access-Control-Allow-Origin", req.headers.origin)
//   res.header("Access-Control-Allow-Headers", "content-type")
//   res.header("Access-Control-Allow-Headers",["content-type",'Authorization']);
//   res.header("Access-Control-Allow-Methods", 'DELETE,PUT,POST,PATCH,GET,OPTIONS')
//   if (req.method.toLowerCase() == 'options') {
//    res.send(200)
//   } else {
//     return  next()
//   }
    
// } else {
//   if (AllowOriginList.includes(req.headers.origin)) {
//     res.header("Access-Control-Allow-Origin", req.headers.origin)
//     res.header("Access-Control-Allow-Headers", "content-type")
//     res.header("Access-Control-Allow-Headers",["content-type",'Authorization']);
//     res.header("Access-Control-Allow-Methods", 'DELETE,PUT,POST,PATCH,GET,OPTIONS')
//     if (req.method.toLowerCase() == 'options') {
//       res.send(200)
//     } else {
//       next()
//     }
//   } else {
//     res.status(404).send({
//       code: 404,
//       msg: 'error'
//     })
//   }
// }
// })


//post中间件

app.use('/api',require('./router'))
app.use('/api/manger',require('./mangerRouter'))

app.use('/static',express.static(resolve(__dirname,'./static')))

const port = 3303
app.listen(port,()=>{
  console.log(`serve in running ${port}`)
})