const mangerRouter = require("express").Router()
const query = require('../../utils/mysql')
const { returnErr } = require('../../utils/returnErr')
const { v4: uuidv4 } = require('uuid');
const jwt = require('../../utils/jsonwebtoken')

//登录
mangerRouter.post('/login', (req, res) => {
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
      const mangerToken = jwt.sendToken({username,password},`${60*30}s`)
      res.setHeader("authorization",mangerToken)
      res.header("Access-Control-Expose-Headers","authorization")
      res.send({ code: 200, msg: '登录成功', data: 'null', manger_id: loginRes[0].manger_id, 
      mangerToken, })
    })
  })
})


//注册
mangerRouter.post('/register', (req, res) => {
  const { username, password, name } = req.body
  if (!username || !password || !name) return returnErr(res, '参数错误')
  const selSql = `select * from manger where username = '${username}' `
  const regSql = `insert into manger(username,password,name,manger_id) values(
    '${username}','${password}','${name}','${uuidv4()}'
  ) `
  query(selSql, (selRes) => {
    if (selRes.length) {
      return returnErr(res, '该账号已存在，请勿重复注册')
    }
    query(regSql, (regRes) => {
      if (regRes.affectedRows >= 1) {
        res.send({ code: 200, msg: '添加管理员成功', data: null })
      } else {
        return returnErr(res, '添加管理员失败')
      }
    })
  })
})


//查询指定管理员
mangerRouter.post('/manger_id', (req, res) => {
  const { manger_id } = req.body
  if (!manger_id) return returnErr(res, '参数错误')
  const selSql = `select * from manger where manger_id = '${manger_id}' `
  query(selSql, (selRes) => {
    const RES = selRes.map(item => {
      if (item.password) {
        delete item.password
      }
      return item
    })
    res.send({ code: 200, msg: '查询成功', data: RES })
  })
})

//查询管理员
mangerRouter.get('/mangers', (req, res) => {
  let { pageOn, pageSize } = req.query
  if (!pageSize || !pageOn) return returnErr(res, '参数错误')
  if (pageSize > 15) {
    pageSize = 15
  }
  const selAllSql = `select count(*) from manger `
  const selSql = `select  * from manger order by id desc limit ${(pageOn - 1) * pageSize} ,${pageSize} `
  query(selAllSql, (selAllRes) => {
    query(selSql, (selRes) => {
      const RES = selRes.map(item => {
        if (item.password) {
          delete item.password
        }
        return item
      })?.filter(item=>item.manger_id!=='791d2237-adf5-4d96-b754-357ab7c2a9bf')
      res.send({
        code: 200,
        msg: '查询成功',
        data: RES,
        total: selAllRes[0]['count(*)']
      })
    })
  })
})

//删除管理员
mangerRouter.delete('/manger', (req, res) => {
  const { manger_id } = req.body
  if (!manger_id) return returnErr(res, '参数错误')
  const selSql = `delete from manger where manger_id = '${manger_id}' `
  const selSql1 = `delete from swiper where manger_id = '${manger_id}' `
  const selSql2 = `delete from position_type where manger_id = '${manger_id}' `
  const selSql3 = `delete from industry where manger_id = '${manger_id}' `
  const selSql4 = `delete from consult where manger_id = '${manger_id}' `
  query(selSql, (selRes) => {
    query(selSql1, (selSql1) => {
      query(selSql2, (selSql2) => {
        query(selSql3, (selSql3) => {
          query(selSql4, (selSql4) => {
            if (selRes.affectedRows >= 1) {
              res.send({ code: 200, msg: '删除管理员成功', data: null })
            } else {
              return returnErr(res, '删除管理员失败')
            }
          })
        })
      })
    })
  })
})


//修改管理员权限
mangerRouter.post('/state', (req, res) => {
  let { state, manger_id } = req.body
  if (!state || !manger_id) return returnErr(res, '参数错误')
  const sql = `update manger set manger_state = '${state}' where manger_id = '${manger_id}'`
  query(sql, result => {
    if (result.affectedRows >= 1) {
      res.send({ code: 200, msg: '修改管理员权限成功', data: null })
    } else {
      return returnErr(res, '修改管理员权限失败')
    }
  })
})

//修改管理员
mangerRouter.patch('/manger', (req, res) => {
  let { manger_id, name, password, username, avatar } = req.body
  if (!username || !manger_id || !name) return returnErr(res, '参数错误')
  let str = ''
  if (avatar) {
    str = `,avatar = '${avatar}'`
  } else {
    str = ''
  }
  let sql = ''
  if (password) {
    sql = `update manger set name = '${name}',
    username = '${username}',password = '${password}' ${str}
    where manger_id = '${manger_id}'`
  } else {
    sql = `update manger set name = '${name}',
        username = '${username}' ${str}
        where manger_id = '${manger_id}'`
  }

  query(sql, result => {
    if (result.affectedRows >= 1) {
      res.send({ code: 200, msg: '修改成功', data: null, flag: password ? true : false })
    } else {
      return returnErr(res, '修改失败')
    }
  })
})

module.exports = mangerRouter