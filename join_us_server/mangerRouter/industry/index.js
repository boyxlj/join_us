const industryRouter = require("express").Router()
const query = require('../../utils/mysql')
const { returnErr } = require('../../utils/returnErr')
const { v4: uuidv4 } = require('uuid');
const jwt = require('../../utils/jsonwebtoken')



//添加行业
industryRouter.post('/industry', (req, res) => {
  const {industry_name , industry_other, manger_id } = req.body
  if (!industry_name  || !manger_id) return returnErr(res, '参数错误')
  const selSql = `select * from industry where industry_name = '${industry_name}' `
  const regSql = `insert into industry(industry_name,industry_other,manger_id,industry_id) values(
    '${industry_name}','${industry_other}','${manger_id}','${uuidv4()}'
  ) `
  query(selSql, (selRes) => {
    if (selRes.length) {
      return returnErr(res, '该行业名称已存在，请勿重复添加')
    }
    query(regSql, (regRes) => {
      if (regRes.affectedRows >= 1) {
        res.send({ code: 200, msg: '添加行业成功', data: null })
      } else {
        return returnErr(res, '添加行业失败')
      }
    })
  })
})


//查询指定行业
industryRouter.post('/industry_id', (req, res) => {
  const { industry_id } = req.body
  if (!industry_id) return returnErr(res, '参数错误')
  const selSql = `select * from industry  inner join manger on industry.manger_id=manger.manger_id  where industry.industry_id = '${industry_id}' `
  query(selSql, (selRes) => {
    const RES = selRes?.map(item => {
      if (item.password) {
        delete item.password
      }
      return item
    })
    res.send({ code: 200, msg: '查询成功', data: RES })
  })
})

//查询所有行业(有分页)
industryRouter.get('/industrys', (req, res) => {
  let { pageOn, pageSize,keyword } = req.query
  if (!pageSize || !pageOn) return returnErr(res, '参数错误')
  if (pageSize > 15) {
    pageSize = 15
  }
  let str = ''
  if(keyword){
    str = `where where industry_name like '%${keyword}%' `
  }
  const selAllSql = `select count(*) from industry  inner join manger on industry.manger_id=manger.manger_id ${str}`
  const selSql = `select  * from industry inner join manger on industry.manger_id=manger.manger_id ${str} order by  industry.id desc limit ${(pageOn - 1) * pageSize} ,${pageSize} `
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
//查询所有行业(无分页)
industryRouter.get('/industrys/show', (req, res) => {
  const sql = `select  * from industry  order by  id desc `
  query(sql, (result) => {
      res.send({
        code: 200,
        msg: '查询成功',
        data: result,
       
      })
      })
})

//删除行业
industryRouter.delete('/manger', (req, res) => {
  const { industry_id } = req.body
  if (!industry_id) return returnErr(res, '参数错误')
  const selSql = `delete from industry where industry_id = '${industry_id}' `
  query(selSql, (selRes) => {
    if (selRes.affectedRows >= 1) {
      res.send({ code: 200, msg: '删除行业成功', data: null })
    } else {
      return returnErr(res, '删除行业失败')
    }
  })
})


//修改行业状态
industryRouter.post('/industry/state', (req, res) => {
  let { state, industry_id } = req.body
  if (!state || !industry_id) return returnErr(res, '参数错误')
  const sql = `update industry set industry_state = '${state}' where industry_id = '${industry_id}'`
  query(sql, result => {
    if (result.affectedRows >= 1) {
      res.send({ code: 200, msg: '修改行业状态成功', data: null })
    } else {
      return returnErr(res, '修改行业状态失败')
    }
  })
})

//修改行业
industryRouter.patch('/industry', (req, res) => {
  let { industry_name , industry_other, industry_id } = req.body
  if (!industry_name || !industry_id ) return returnErr(res, '参数错误')
  let sql =  `update industry set industry_name = '${industry_name}',
  industry_other = '${industry_other}',updateTime = '${new Date().toLocaleString().replaceAll('/','-')}'
    where industry_id = '${industry_id}'`
  query(sql, result => {
    if (result.affectedRows >= 1) {
      res.send({ code: 200, msg: '修改成功', data: null })
    } else {
      return returnErr(res, '修改失败')
    }
  })
})

module.exports = industryRouter