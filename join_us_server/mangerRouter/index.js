const mangerRouter = require("express").Router()


mangerRouter.use(require("./consult"))
mangerRouter.use(require("./upload"))

module.exports = mangerRouter


// const consultRouter = require("express").Router()
// const query = require('../../utils/mysql')
// const { returnErr } = require('../../utils/returnErr')
// const { v4: uuidv4 } = require('uuid');


// consultRouter.get('/',(req,res)=>{
//   res.send({code:200,nsg:"ok"})
// })

// module.exports = consultRouter