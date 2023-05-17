const express = require("express")
const SwiperRouter = express.Router()
const query = require('../../utils/mysql')
const { returnErr } = require('../../utils/returnErr')
const { v4: uuidv4 } = require('uuid');



//查询所有轮播
SwiperRouter.get('/swipers', (req, res) => {
  let { pageOn, pageSize } = req.query
  if (!pageSize || !pageOn) return returnErr(res, '参数错误')
  if (pageSize > 15) {
    pageSize = 15
  }
  const selAllSql = `select count(*) from swiper  inner join manger on swiper.manger_id=manger.manger_id `
  const selSql = `select  * from swiper inner join manger on swiper.manger_id=manger.manger_id  order by  swiper.id desc limit ${(pageOn - 1) * pageSize} ,${pageSize} `
  query(selAllSql, (selAllRes) => {
    query(selSql, (selRes) => {
      const RES = selRes?.map(item => {
        if (item.password) {
          delete item.password
        }
        return item
      })
      res.send({
        code: 200,
        msg: '查询成功',
        data: RES,
        total: selAllRes[0]['count(*)']
      })
    })
  })
})

//添加轮播
SwiperRouter.post('/swiper', (req, res) => {
  const { img, others,links, manger_id } = req.body
  if (!img || !manger_id) return returnErr(res, '参数错误')
  const regSql = `insert into swiper(img,others,manger_id,links,swiper_id) values(
    '${img}','${others}','${manger_id}','${links}','${uuidv4()}'
  ) `
  query(regSql, (regRes) => {
    if (regRes.affectedRows >= 1) {
      res.send({ code: 200, msg: '添加轮播成功', data: null })
    } else {
      return returnErr(res, '添加轮播失败')
    }
  })
})

//删除轮播
SwiperRouter.delete('/swiper', (req, res) => {
  const { swiper_id } = req.body
  if (!swiper_id) return returnErr(res, '参数错误')
  const selSql = `delete from swiper where swiper_id = '${swiper_id}' `
  query(selSql, (selRes) => {
    if (selRes.affectedRows >= 1) {
      res.send({ code: 200, msg: '删除轮播成功', data: null })
    } else {
      return returnErr(res, '删除轮播失败')
    }
  })
})


//修改轮播状态
SwiperRouter.post('/swiper/state', (req, res) => {
  let { state, swiper_id } = req.body
  if (!state || !swiper_id) return returnErr(res, '参数错误')
  const sql = `update swiper set state = '${state}' where swiper_id = '${swiper_id}'`
  query(sql, result => {
    if (result.affectedRows >= 1) {
      res.send({ code: 200, msg: '修改轮播状态成功', data: null })
    } else {
      return returnErr(res, '修改轮播状态失败')
    }
  })
})
//修改轮播
SwiperRouter.patch('/swiper', (req, res) => {
  let { img , others,links, swiper_id } = req.body
  if (!img || !swiper_id ) return returnErr(res, '参数错误')
  let sql =  `update swiper set img = '${img}',
  others = '${others}',links = '${links}'
    where swiper_id = '${swiper_id}'`
  query(sql, result => {
    if (result.affectedRows >= 1) {
      res.send({ code: 200, msg: '修改成功', data: null })
    } else {
      return returnErr(res, '修改失败')
    }
  })
})


module.exports = SwiperRouter