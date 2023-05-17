const mangerRouter = require("express").Router()


mangerRouter.use(require("./consult"))
mangerRouter.use(require("./upload"))
mangerRouter.use(require("./manger"))
mangerRouter.use(require("./industry"))
mangerRouter.use(require("./company"))
mangerRouter.use(require("./positionType"))
mangerRouter.use(require("./user"))
mangerRouter.use(require("./position"))
mangerRouter.use(require("./hr"))
mangerRouter.use(require("./swiper"))

module.exports = mangerRouter


// const consultRouter = require("express").Router()
// const query = require('../../utils/mysql')
// const { returnErr } = require('../../utils/returnErr')
// const { v4: uuidv4 } = require('uuid');


// consultRouter.get('/',(req,res)=>{
//   res.send({code:200,nsg:"ok"})
// })

// module.exports = consultRouter