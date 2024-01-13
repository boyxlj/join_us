const consultRouter = require("express").Router()
const query = require('../../utils/mysql')
const { returnErr } = require('../../utils/returnErr')
const { v4: uuidv4 } = require('uuid');
const { noAllowConsultArr } = require('../../config/noAllowConsult');
const categoryData = [
  { id: 0, categoryName: "求职必读" },
  { id: 1, categoryName: "数据报告" },
  { id: 2, categoryName: "干货文章" },
  { id: 3, categoryName: "公司动态" },
]
//获取资讯分类
consultRouter.get('/category', (req, res) => {
  res.send({ code: 200, msg: "查询成功", data: categoryData })
})


//发布资讯
consultRouter.post('/consult', (req, res) => {
  let { manger_id, category, content, cover_img, title, descs } = req.body
  if (!manger_id || !category || !content || !title || !descs) return returnErr(res, '参数错误')
  content = content?.replaceAll("'", '"')
  const sql = `insert into consult(manger_id,category,content,cover_img,title,descs,consult_id) 
  values('${manger_id}','${category}','${content}','${cover_img}','${title}','${descs}','${uuidv4()}') `
  query(sql, result => {
    if (result.affectedRows >= 1) {
      res.send({ code: 200, msg: '发布资讯成功', data: null })
    } else {
      return returnErr(res, '发布资讯失败')
    }
  })

})


//查询资讯
consultRouter.get('/consults', (req, res) => {
  let { category, pageOn, pageSize, keyword } = req.query
  if (!pageOn || !pageSize) return returnErr(res, '参数错误')
  if (pageSize >= 10) {
    pageSize = 10
  }
  let str = ''
  let sql = ''
  let sqlCount = ''
  if (category) {
    if (keyword) {
      str = ` and (consult.category like '%${keyword}%' or consult.title like '%${keyword}%')  `
    }
    sqlCount = `select count(*) from consult  inner join manger on consult.manger_id = manger.manger_id where category = '${category}' ${str} `
    sql = `select * from consult inner join manger on consult.manger_id = manger.manger_id  where category = '${category}' ${str} order by consult.id desc limit ${(pageOn - 1) * pageSize} ,${pageSize}`
  } else {
    if (keyword) {
      str = `where consult.category like '%${keyword}%' or consult.title like '%${keyword}%'`
    }
    sqlCount = `select count(*) from consult inner join manger on consult.manger_id = manger.manger_id ${str}`
    sql = `select * from consult inner join manger on consult.manger_id = manger.manger_id  ${str} order by consult.id desc  limit ${(pageOn - 1) * pageSize} ,${pageSize} `
  }
  query(sqlCount, countResult => {
    query(sql, result => {
      const RES = result.map(item => {
        if (item.password) {
          delete item.password
          delete item.username
        }
        return item
      })
      res.send({ code: 200, msg: '查询资讯成功', total: countResult[0]['count(*)'], data: RES })
    })
  })
})

//修改资讯状态
consultRouter.post('/consult/state', (req, res) => {
  let { state, consult_id } = req.body
  if (!state || !consult_id) return returnErr(res, '参数错误')
  const sql = `select * from consult inner join manger on consult.manger_id = manger.manger_id where consult.consult_id='${consult_id}' `
  query(sql, result => {
    if (!result.length) return returnErr(res, '资讯状态修改失败')
    const updateSql = `update consult set  state = '${state}' where consult_id='${consult_id}'`
    query(updateSql, updateRes => {
      if (updateRes.affectedRows >= 1) {
        res.send({ code: 200, msg: '资讯状态修改成功', data: null })
      } else {
        return returnErr(res, '资讯状态修改失败')
      }
    })
  })
})




//修改资讯
consultRouter.patch('/consult', (req, res) => {
  let { consult_id, category, content, cover_img, title, descs } = req.body
  // consult_id
  if (!consult_id || !category || !content || !title || !descs) return returnErr(res, '参数错误')
  content = content?.replaceAll("'", '"')


  const sql = `update consult set category = '${category}',content = '${content}',
  title = '${title}',descs = '${descs}',cover_img = '${cover_img}',updateTime = '${new Date().toLocaleString().replaceAll('/', '-')}'
  where consult_id = '${consult_id}'`
  query(sql, result => {
    if (result.affectedRows >= 1) {
      res.send({ code: 200, msg: '资讯修改成功', data: null })
    } else {
      return returnErr(res, '资讯修改失败')
    }
  })
})


//删除资讯
consultRouter.delete('/consult', (req, res) => {
  const { consult_id } = req.body
  if (!consult_id) return returnErr(res, '参数错误')
  if (noAllowConsultArr.includes(consult_id)) return returnErr(res, '该资讯内容很重要，无法删除')
  const sql = `delete from consult where consult_id = '${consult_id}'`
  query(sql, result => {
    if (result.affectedRows >= 1) {
      res.send({ code: 200, msg: '删除资讯成功', data: null })
    } else {
      return returnErr(res, '删除资讯失败')
    }
  })
})
module.exports = consultRouter