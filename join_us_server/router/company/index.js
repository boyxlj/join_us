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

    if (ResStr.includes('where')) {
      ResStr += ` and company.state = '1'`
    } else {
      ResStr += ` where company.state = '1'`
    }
    if (pageSize >= 30) {
      pageSize = 30
    }
    const sqlCount = `select count(*)  from  company inner join pos on pos.company_id = company.company_id ${ResStr} order by company.id desc
  `
    const sql = `select * from company inner join pos on pos.company_id = company.company_id ${ResStr} order by company.id desc
    limit ${(pageOn - 1) * pageSize},${pageSize}
  `

    query(sqlCount, count => {
      query(sql, result => {
        res.status(200).send({ code: 200, msg: 'ok', data: result, total: count[0]['count(*)'] })
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
  const sqlCount = `select count(*)  from  company inner join pos on company.company_id = pos.company_id 
  where  company.company_id='${company_id}' and pos.position_state='1'  order by company.id desc
  `
  const selectBoss = `select count(*) from company inner join hr on hr.company_id = company.company_id`
  const selectCompany_photoSql = `select * from company_photo  where company_id='${company_id}' `
  const companySql = `select * from company where company_id='${company_id}' `
  const sql = `select * from pos inner join company on company.company_id = company.company_id
  inner join hr on hr.hr_id = pos.hr_id 
  where  company.company_id='${company_id}' and pos.position_state='1'  order by company.id desc
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
               positionCount: count[0]['count(*)'],
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




module.exports = companyRouter