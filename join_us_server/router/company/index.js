const express = require("express")
const companyRouter = express.Router()
const query = require('../../utils/mysql')
const { returnErr } = require('../../utils/returnErr')
const { v4: uuidv4 } = require('uuid');
//公司表



//公司信息表  post:参数传递{}
companyRouter.post('/companys', (req, res) => {
  let { pageOn, pageSize } = req.body
  const arr = ['pageOn', 'pageSize', 'industry', 'company_name', 'people_num',
    'reg_city', 'financing', 'financing', 'region',
  ]
  delete req.body.pageOn
  delete req.body.pageSize
  if (req.body.reg_city == '全国') {
    delete req.body.reg_city
    let str = ''
    // function getKeySql(val) {
    //   return `(position_name like '%${val}%' or position_type1 like '%${val}%'  or company_name like '%${val}%')`
    // }
    // let vsKey = 'where '
    // if (req.body.keyword) {
    //   vsKey += getKeySql(req.body.keyword)
    // } else {
    //   vsKey = ''
    // }
    let vsKey = ''
    for (let i in req.body) {
      if (!arr.includes(i)) {
        delete req.body[i]
      }
    }
    if (Object.keys(req.body).length) {
      for (let i in req.body) {
        str += ` and company.${i} = '${req.body[i]}' `
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
    if (ResStr.includes('where')) {
      ResStr += ` and company.state = '1'`
    } else {
      ResStr += ` where company.state = '1'`
    }
    if (pageSize >= 30) {
      pageSize = 30
    }
    const sqlCount = `select count(*) from  company inner join pos on pos.company_id = company.company_id ${ResStr}`
    const sql = `select * from company inner join pos on pos.company_id = company.company_id ${ResStr}  order by company.id desc 
    limit ${(pageOn - 1) * pageSize},${pageSize}
    `
    query(sqlCount, count => {
      query(sql, result => {
        res.status(200).send({ code: 200, msg: 'ok', data: result, total: count[0]['count(*)'] })
      })
    })
  } else {
    let str = ''
    // function getKeySql(val) {
    //   return `(position_name like '%${val}%' or position_type1 like '%${val}%'  or company_name like '%${val}%')`
    // }
    // let vsKey = 'where '
    // if (req.body.keyword) {
    //   vsKey += getKeySql(req.body.keyword)
    // } else {
    //   vsKey = ''
    // }
    let vsKey = ''
    for (let i in req.body) {
      if (!arr.includes(i)) {
        delete req.body[i]
      }
    }
    if (Object.keys(req.body).length) {
      for (let i in req.body) {
        str += ` and company.${i} = '${req.body[i]}' `
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

    if (ResStr.includes('where')) {
      ResStr += ` and company.state = '1'`
    } else {
      ResStr += ` where company.state = '1'`
    }
    if (pageSize >= 32) {
      pageSize = 32
    }
    const sqlCount = `select count(*)  from  company inner join pos on pos.company_id = company.company_id ${ResStr} order by company.id desc
  `
    const sql = `select * from company inner join pos on pos.company_id = company.company_id ${ResStr} order by company.id desc
    limit ${(pageOn - 1) * pageSize},${pageSize}
  `

    query(sqlCount, count => {
      query(sql, result => {
        res.status(200).send({ 
          code: 200, msg: 'ok', data: result, total: count[0]['count(*)'] })
      })
    })
  }


})



//通过公司id查询对应职位
companyRouter.post('/company/positions', (req, res) => {
  let { pageOn, pageSize, company_id } = req.body
  // console.log(req.body)
  if (!company_id || !pageSize || !pageOn) return returnErr(res, '参数错误')
  const arr = ['pageOn', 'pageSize', 'keyword',
    'company_name', 'industry', "cityName", "experiences", "degrees", "salary",
  ]
  delete req.body.pageOn
  delete req.body.pageSize
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
    if (!arr.includes(i)) {
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
  if (ResStr.includes('where')) {
    ResStr += ` and pos.position_state = '1' and pos.company_id='${company_id}'`
  } else {
    ResStr += ` where pos.position_state = '1' and pos.company_id='${company_id}'`
  }
  const sqlCount = `select count(*)  from  pos inner join hr on pos.hr_id = hr.hr_id  ${ResStr} order by pos.id desc
  `
  const sql = `select * from pos  inner join hr on pos.hr_id = hr.hr_id ${ResStr} order by pos.id desc
    limit ${(pageOn - 1) * pageSize},${pageSize}
  `
  query(sqlCount, count => {
    query(sql, result => {
      const workCities = result?.map(item => item.cityName) || []
      const data = result?.map(item => {
        if (item.password) {
          delete item.password
        }
        if (item.telephone) {
          delete item.telephone
        }
        return item
      })?.slice(0, 8)
      res.status(200).send({ code: 200, msg: 'ok', data, total: count[0]['count(*)'], workCities })
    })
  })
})

//查询公司信息以及对应的职位
companyRouter.post('/companyInfo', (req, res) => {
  let { company_id } = req.body
  if (!company_id) return returnErr(res, '参数错误')
  const sqlCount = `select *  from  pos  
  where  company_id='${company_id}' and position_state='1'  
  `
  const selectBoss = `select count(*) from hr where company_id = '${company_id}'`
  const selectCompany_photoSql = `select * from company_photo  where company_id='${company_id}' `
  const companySql = `select * from company where company_id='${company_id}' `
  const sql = `select * from pos inner join hr on hr.hr_id = pos.hr_id 
  where  pos.company_id='${company_id}' and pos.position_state='1'  order by pos.id desc
  `
  query(companySql, companyRes => {
    query(sqlCount, count => {
      query(selectCompany_photoSql, selectCompany_photoRes => {
        query(selectBoss, BossRes => {
          query(sql, result => {
            const data = result?.map(item => {
              if (item.password) {
                delete item.password
              }
              if (item.telephone) {
                delete item.telephone
              }
              return item
            })?.slice(0, 8)
            // res.status(200).send({ code: 200, msg: 'ok', data})
            res.status(200).send({
              code: 200, msg: '查询成功',
              bossCount: BossRes[0]['count(*)'],
              positionCount: data.length,
              companyInfo: companyRes,
              companyPhotos: selectCompany_photoRes,
              posData: data
            })
          })
        })
      })
    })
  })
})



//查询公司的相册
companyRouter.get('/company/photos', (req, res) => {
  let { company_id } = req.query
  if (!company_id) return returnErr(res, '参数错误')
  const sql = `select * from company_photo  where company_id='${company_id}' `
  query(sql, result => {
    res.status(200).send({ code: 200, msg: 'ok', data:result})
  })
})

//修改公司信息(企业端)
companyRouter.patch('/hr/company', (req, res) => {
  const allowArr = [
    'company_name',
    'industry',
    'people_num',
    'financing',
    'legal_representative',
    'create_time',
    'reg_city',
    'region',
    'detail_position',
    'capital',
    'business_scope',
    'company_introduction',
    'work_time',
    'company_welfare',
    'development',
    'development_history',
    'rest',
    'company_id',
    'logo'
  ]
  let logo = req.body.logo
  delete req.body.logo
  for (let i in req.body) {
    if (!allowArr.includes(i)) {
      return returnErr(res, '参数错误')
    }
  }

  let saveCompany_id = req.body.company_id
  delete req.body.company_id
  let str = ''
  for (let i in req.body) {
    str += `${i} = '${req.body[i]}',`
  }
  const sql = `update company
  set ${str} logo = '${logo}',state = '0' where company_id = '${saveCompany_id}'`
  query(sql, (result) => {
        if (result.affectedRows >= 1) {
          res.status(200).send({
            code: 200,
            data: null,
            msg: '修改公司信息成功'
          });
        } else {
          return returnErr(res, "修改公司信息失败");
        }

  })
})

//获取公司状态(企业端)
companyRouter.get('/company/state', (req, res) => {
  let { company_id } = req.query
  if (!company_id) return returnErr(res, '参数错误')
  const sql = `select state from company  where company_id='${company_id}' `
  query(sql, result => {
    res.status(200).send({ code: 200, msg: 'ok', state:result[0].state})
  })
})


//查询所有公司(企业端)
companyRouter.get('/companys/all', (req, res) => {
  const sql = `select company_name,company_id from company  `
  query(sql, result => {
    res.status(200).send({ code: 200, msg: 'ok', data:result})
  })
})

module.exports = companyRouter