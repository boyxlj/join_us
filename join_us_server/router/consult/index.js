const consultRouter = require("express").Router()
const query = require('../../utils/mysql')
const { returnErr } = require('../../utils/returnErr')
const categoryData = [
  { id: 1, categoryName: "求职必读" },
  { id: 2, categoryName: "数据报告" },
  { id: 3, categoryName: "干货文章" },
  { id: 4, categoryName: "公司动态" },
]
//获取资讯分类
consultRouter.get('/category', (req, res) => {
  res.send({ code: 200, msg: "查询成功", data: categoryData })
})


//查询资讯
consultRouter.get('/consults', (req, res) => {
  let { category, pageOn, pageSize } = req.query
  if (!pageOn || !pageSize) return returnErr(res, '参数错误')
  if (pageSize >= 10) {
    pageSize = 10
  }
  let sql = ''
  let sqlCount = ''
  if (category) {
    sqlCount = `select count(*) from consult inner join manger on consult.manger_id = manger.manger_id where consult.category = '${category}' and consult.state='1' `
    sql = `select * from consult inner join manger on consult.manger_id = manger.manger_id where consult.category = '${category}' and consult.state='1' order by consult.id desc limit ${(pageOn - 1) * pageSize} ,${pageSize}`
  } else {
    sqlCount = `select count(*) from consult inner join manger on consult.manger_id = manger.manger_id where  consult.state='1' `
    sql = `select * from consult inner join manger on consult.manger_id = manger.manger_id where  consult.state='1' order by consult.id desc  limit ${(pageOn - 1) * pageSize} ,${pageSize} `
  }
  query(sqlCount, countResult => {
    query(sql, result => {
      res.send({ code: 200, msg: '查询资讯成功', total: countResult[0]['count(*)'], data: result })
    })
  })
})



//查询指定资讯
consultRouter.get('/consult', (req, res) => {
  let { consult_id } = req.query
  if (!consult_id) return returnErr(res, '参数错误')
  const sql = `select * from consult inner join manger on consult.manger_id = manger.manger_id where consult.state = '1' and consult.consult_id='${consult_id}' `
  query(sql, (result) => {
    if (result.length ) {
      res.send({
        code: 200,
        msg: '查询资讯成功',
        data:result
      })
    } else {
      return returnErr(res, "查询资讯失败");
    }
  })
})






module.exports = consultRouter