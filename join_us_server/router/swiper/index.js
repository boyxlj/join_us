const express = require("express")
const SwiperRouter = express.Router()
const query = require('../../utils/mysql')
const { returnErr } = require('../../utils/returnErr')
const { v4: uuidv4 } = require('uuid');



//查询所有轮播
SwiperRouter.get('/swipers', (req, res) => {
   const selSql = `select  * from swiper where state ='1'`
    query(selSql, (selRes) => {
      const RES = selRes.map(item=>{
        return {
          links:item.links,
          id:item.id,
          imgUrl:item.img
        }
      })
      res.send({
        code: 200,
        msg: '查询成功',
        data: RES,
      })
  })
})



module.exports = SwiperRouter