const userRouter = require("express").Router()
const query = require('../../utils/mysql')
const { returnErr } = require('../../utils/returnErr')
const { v4: uuidv4 } = require('uuid');
const jwt = require('../../utils/jsonwebtoken')
const {dealEmail} =  require("../../utils/dealNum")
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
        item.email = dealEmail(item.email)
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
  if (!userId) return returnErr(res, '参数错误')
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

//删除用户
userRouter.delete('/user', (req, res) => {
  const { userId } = req.body
  if (!userId) return returnErr(res, '参数错误')
  const selSql = `delete from userinfo where userId = '${userId}' `
  const sendSql = `delete from send where userId = '${userId}' `
  const resumeSql = `delete from resume where userId = '${userId}' `
  const collectSql = `delete from collect where userId = '${userId}' `
  query(selSql, (selRes) => {
    query(sendSql, (selRes2) => {
      query(resumeSql, (selRes3) => {
        query(collectSql, (selAllRes) => {
          if (selRes.affectedRows >= 1) {
            res.send({ code: 200, msg: '删除用户成功', data: null })
          } else {
            return returnErr(res, '删除用户失败')
          }
        })
      })
    })
  })
})


//修改用户状态
userRouter.post('/user/state', (req, res) => {
  let { state, userId } = req.body
  if (!state || !userId) return returnErr(res, '参数错误')
  const sql = `update userinfo set userState = '${state}' where userId = '${userId}'`
  query(sql, result => {
    if (result.affectedRows >= 1) {
      res.send({ code: 200, msg: '修改用户状态成功', data: null })
    } else {
      return returnErr(res, '修改用户状态失败')
    }
  })
})



module.exports = userRouter