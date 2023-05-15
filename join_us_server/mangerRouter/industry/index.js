const industryRouter = require("express").Router()
const query = require('../../utils/mysql')
const { returnErr } = require('../../utils/returnErr')
const { v4: uuidv4 } = require('uuid');
const jwt = require('../../utils/jsonwebtoken')

//登录
industryRouter.post('/login', (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return returnErr(res, '参数错误')
  const selSql = `select * from manger where username = '${username}' `
  const loginSql = `select * from manger where username = '${username}' and password = '${password}'`
  query(selSql, (selRes) => {
    if (!selRes.length) {
      return returnErr(res, '账号不存在')
    }
    query(loginSql, (loginRes) => {
      if (!loginRes.length) {
        return returnErr(res, '密码不正确')
      }
      res.send({ code: 200, msg: '登录成功', data: 'null', manger_id: loginRes[0].manger_id, mangerToken: jwt.sendToken({ username }, '1day') })
    })
  })
})


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

//查询所有行业
industryRouter.get('/industrys', (req, res) => {
  let { pageOn, pageSize } = req.query
  if (!pageSize || !pageOn) return returnErr(res, '参数错误')
  if (pageSize > 15) {
    pageSize = 15
  }
  const selAllSql = `select count(*) from industry  inner join manger on industry.manger_id=manger.manger_id`
  const selSql = `select  * from industry inner join manger on industry.manger_id=manger.manger_id order by  industry.id desc limit ${(pageOn - 1) * pageSize} ,${pageSize} `
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