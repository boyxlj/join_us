const express = require("express")
const hrRouter = express.Router()
const query = require('../../utils/mysql')
const { returnErr } = require('../../utils/returnErr')
const { v4: uuidv4 } = require('uuid');

//查询所有人事
hrRouter.get('/hrs', (req, res) => {
  let { pageOn, pageSize, keyword } = req.query
  if (!pageSize || !pageOn) return returnErr(res, '参数错误')
  if (pageSize > 15) {
    pageSize = 15
  }
  let str = ''
  if (keyword) {
    str = `where hr.name like '%${keyword}%' `
  }
  const selAllSql = `select count(*) from hr  inner join company on hr.company_id=company.company_id ${str}`
  const selSql = `select  * from hr inner join company on hr.company_id=company.company_id ${str} order by  hr.id desc limit ${(pageOn - 1) * pageSize} ,${pageSize} `
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

//删除人事
hrRouter.delete('/hr', (req, res) => {
  const { hr_id } = req.body
  if (!hr_id) return returnErr(res, '参数错误')
  const selSql = `delete from hr where hr_id = '${hr_id}' `
  const selSql1 = `delete from pos where hr_id = '${hr_id}' `
  query(selSql, (selRes) => {
    query(selSql1, (selRes1) => {
      if (selRes.affectedRows >= 1) {
        res.send({ code: 200, msg: '删除人事成功', data: null })
      } else {
        return returnErr(res, '删除人事失败')
      }
    })
  })
})


//修改人事状态
hrRouter.post('/hr/state', (req, res) => {
  let { state, hr_id } = req.body
  if (!state || !hr_id) return returnErr(res, '参数错误')
  const sql = `update hr set hr_state = '${state}' where hr_id = '${hr_id}'`
  query(sql, result => {
    if (result.affectedRows >= 1) {
      res.send({ code: 200, msg: '修改人事状态成功', data: null })
    } else {
      return returnErr(res, '修改人事状态失败')
    }
  })
})



module.exports = hrRouter