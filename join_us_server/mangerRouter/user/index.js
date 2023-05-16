const userRouter = require("express").Router()
const query = require('../../utils/mysql')
const { returnErr } = require('../../utils/returnErr')
const { v4: uuidv4 } = require('uuid');
const jwt = require('../../utils/jsonwebtoken')

//查询所有用户信息
userRouter.post('/users', (req, res) => {
  let { pageOn, pageSize } = req.body
  if (!pageSize || !pageOn) return returnErr(res, '参数错误')
  if (pageSize > 15) {
    pageSize = 15
  }
  const selAllSql = `select count(*) from userinfo  `
  const selSql = `select  * from userinfo order by id desc limit ${(pageOn - 1) * pageSize} ,${pageSize} `
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


//查看在线简历
userRouter.get('/send/onlineResume', (req, res) => {
  const { userId } = req.query
  if(!userId) return returnErr(res,'参数错误')
  const resume_sql = `select * from resume where userId = '${userId}'`
  const userInfo_sql = `select * from userinfo where userId = '${userId}'`
  query(resume_sql, (result1) => {
      query(userInfo_sql, (result2) => {
        if (result2.length) {
          const data = result2[0]
          data.resume = result1
          // data.advantage.replaceAll(/\\n/, '<br/>')
          res.send({
            code: 200,
            data: data,
            msg: '查询成功'
          })
        } else {
          return returnErr(res, '查询失败!')
        }
      })
  })
})
module.exports = userRouter