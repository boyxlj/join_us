const express = require("express")
const positionRouter = express.Router()
const query = require('../../utils/mysql')
const { returnErr } = require('../../utils/returnErr')
const { v4: uuidv4 } = require('uuid');



//职位信息表  post:参数传递{}
positionRouter.post('/positions', (req, res) => {
  let { pageOn, pageSize } = req.body
  const arr = ['pageOn', 'pageSize', 'position_name', 'cityName', 'salary', 'region', 'experiences', 'degrees',
    'position_type1', 'position_type2','position_state' ,'job_type', 'people_num', 'company_name', 'industry', 'financing'
  ]
  delete req.body.pageOn
  delete req.body.pageSize
  if (!req.body.cityName) {
    delete req.body.cityName
    let str = ''
    function getKeySql(val) {
      return `(position_name like '%${val}%' or position_type1 like '%${val}%'  or company_name like '%${val}%')`
    }
    let vsKey = 'where '
    if (req.body.keyword) {
      vsKey += getKeySql(req.body.keyword)
    } else {
      vsKey = ''
    }
    for (let i in req.body) {
      if (!arr.includes(i) || !req.body[i]) {
        delete req.body[i]
      }
    }
    if (Object.keys(req.body).length) {
      for (let i in req.body) {
        str += ` and ${i} = '${req.body[i]}' `
      }
    } else {
      str = ''
    }
    let ResStr = ''
    if (str || vsKey) {
      vsKey = vsKey ? vsKey : 'where'
      if (vsKey == 'where') {
        str = str.slice(4)
      }
      ResStr = !vsKey == 'where' ? vsKey + ' and ' + str : vsKey + str
    } else {
      ResStr = ''
    }
    if (pageSize >= 10) {
      pageSize = 10
    }
    if(ResStr.includes('where')){
      ResStr+=` `
    }else{
      ResStr+=``
    }
    const sqlCount = `select count(*) from  pos inner join company on pos.company_id = company.company_id ${ResStr}`
    const sql = `select * from pos inner join company on pos.company_id = company.company_id ${ResStr}  order by pos.id desc 
    limit ${(pageOn - 1) * pageSize},${pageSize}
  `
    query(sqlCount, count => {
      query(sql, result => {
        res.status(200).send({ code: 200, msg: 'ok', data: result, total: count[0]['count(*)'] })
      })
    })
  } else {
    let str = ''
    function getKeySql(val) {
      return `(position_name like '%${val}%' or position_type1 like '%${val}%'  or company_name like '%${val}%')`
    }
    let vsKey = 'where '
    if (req.body.keyword) {
      vsKey += getKeySql(req.body.keyword)
    } else {
      vsKey = ''
    }
    for (let i in req.body) {
      if (!arr.includes(i) || !req.body[i]) {
        delete req.body[i]
      }
    }

    if (Object.keys(req.body).length) {
      for (let i in req.body) {
        str += ` and ${i} = '${req.body[i]}' `
      }
    } else {
      str = ''
    }
    let ResStr = ''
    if (str || vsKey) {
      vsKey = vsKey ? vsKey : 'where'
      if (vsKey == 'where') {
        str = str.slice(4)
      }
      ResStr = !vsKey == 'where' ? vsKey + ' and ' + str : vsKey + str
    } else {
      ResStr = ''
    }
    if (pageSize >= 10) {
      pageSize = 10
    }
    if(ResStr.includes('where')){
      ResStr+=` `
    }else{
      ResStr+=` `
    }
    const sqlCount = `select count(*)  from  pos inner join company on pos.company_id = company.company_id ${ResStr} order by pos.id desc
  `
    const sql = `select * from pos inner join company on pos.company_id = company.company_id ${ResStr} order by pos.id desc
    limit ${(pageOn - 1) * pageSize},${pageSize}
  `
    query(sqlCount, count => {
      query(sql, result => {
        res.status(200).send({ code: 200, msg: 'ok', data: result, total: count[0]['count(*)'] })
      })
    })
  }


})


//删除职位
positionRouter.delete('/position', (req, res) => {
  const { position_id } = req.body
  if (!position_id) return returnErr(res, '参数错误')
  const selSql = `delete from pos where position_id = '${position_id}' `
  query(selSql, (selRes) => {
  
          if (selRes.affectedRows >= 1) {
            res.send({ code: 200, msg: '删除职位成功', data: null })
          } else {
            return returnErr(res, '删除职位失败')
          }
  })
})






//修改职位状态
positionRouter.post('/position/state', (req, res) => {
  let { position_id ,state} = req.body
  if (!position_id ||  !state) return returnErr(res, '参数错误')
  if((state*1)<0 || (state*1)>2) return returnErr(res, '参数错误')
  const sql = `update pos set position_state = '${state}' where position_id='${position_id}' `
  query(sql, result => {
    if (result.affectedRows >= 1) {
      res.send({ code: 200, msg: '修改职位状态成功', data: null })
    } else {
      return returnErr(res, '修改职位状态失败')
    }
  })
})






module.exports = positionRouter


