const express = require("express")
const hrRouter = express.Router()
const query = require('../../utils/mysql')
const { v4: uuidv4, v4 } = require("uuid");
const jwt = require("../../utils/jsonwebtoken");
const { returnErr } = require("../../utils/returnErr");
//人事表

// hr登陆或注册
hrRouter.post('/hr/LoginOrRegister', (req, res) => {
  const { telephone, password } = req.body
  const time = new Date().toLocaleString()
  const hr_id = v4()
  const queryHrSQl = `select * from hr where telephone = '${telephone}'`
  const companyToken = jwt.sendToken({ telephone }, '1day')
  query(queryHrSQl, (result) => {
    if (result.length) {
      res.setHeader("authorizations", companyToken)
      res.header("Access-Control-Expose-Headers", "authorizations")
      return res.send({
        code: 200,
        msg: '企业登录成功',
        data: null,
        company_id: result[0].company_id,
        hr_id: result[0].hr_id,
        token:companyToken
      })
    } else {
      const lengthSQl = 'select * from hr'
      query(lengthSQl, (result1) => {
        const insertSQl = `insert into hr(id, hr_id, name, company_id, telephone, password, avatar, reg_time) values('${result1.length + 1}', '${hr_id}', '', '', '${telephone}', '${password}', '', '${time}')`
        query(insertSQl, (result2) => {
          if (result2.affectedRows) {
            return res.send({
              code: 200,
              msg: '注册成功',
              data: null,
              data: null,
              hr_id,
              remark: '该用户为首次注册',
              token: jwt.sendToken({ telephone }, '1day')
            })
          } else {
            return returnErr(res, '注册失败')
          }
        })
      })
    }
  })
})

// 企业职位列表管理
hrRouter.get('/hr/positionManage', (req, res) => {
  const { company_id, pageIndex, pageSize } = req.query
  const sql1 = `select * from pos where company_id = '${company_id}'`
  query(sql1, (result1) => {
    const sql = `select * from pos where company_id = '${company_id}' order by id desc limit ${(pageIndex - 1) * pageSize}, ${pageSize}`
    query(sql, (result) => {
      if (result.length) {
        res.status(200).send({
          code: 200,
          msg: '请求成功',
          data: result,
          total: result1.length
        })
      } else {
        return returnErr(res, '请求失败')
      }
    })
  })
})

// 查看企业职位详情
hrRouter.get('/hr/positionDetail', (req, res) => {
  const { position_id } = req.query
  const sql = `select * from pos, company, hr where position_id = '${position_id}' and pos.company_id = company.company_id and hr.hr_id = pos.hr_id`;
  query(sql, (result) => {
    if (result.length) {
      delete result[0].password
      result[0].position_tag = JSON.parse(result[0].position_tag);
      result[0].welfare_tag = JSON.parse(result[0].welfare_tag);
      res.status(200).send({
        code: 200,
        msg: '请求成功',
        data: result[0]
      })
    } else {
      // return returnErr(res, '请求失败')
      res.status(200).send({
        code: 200,
        msg: '请求成功',
        data: []
      })
    }
  })
})

// hr发布职位
hrRouter.post("/hr/addPosition", (req, res) => {
  const { company_id, telephone, formData } = req.body
  const hr_id_sql = `select hr_id from hr where telephone = '${telephone}'`
  query(hr_id_sql, (result) => {
    const hr_id = result[0].hr_id
    const orderNumSql = 'select max(id) as num from pos'
    query(orderNumSql, (result2) => {
      const orderNum = result2[0].num
      const sql = `insert into pos values(${orderNum + 1},'${v4()}', '${formData.position_name}', '${formData.salary}', '${formData.cityArr[1]}', '${formData.cityArr[2]}', '${formData.experiences}', '${formData.degrees}',  '${JSON.stringify([formData.experiences, formData.degrees])}', '${JSON.stringify(formData.welfare_tag)}', '${company_id}', '${hr_id}', '${formData.position_desc}', '${new Date().toLocaleString().replaceAll('/', '-')}', '${new Date().toLocaleString().replaceAll('/', '-')}', '0', '${formData.position_type[0]}', '${formData.position_type[1]}', '${formData.job_type}')`
      query(sql, (result3) => {
        if (result3.affectedRows === 1) {
          res.status(200).send({
            code: 200,
            msg: '发布职位成功',
            data: null
          })
        } else {
          return returnErr(res, '职位发布失败')
        }
      })
    })
  })
});

//hr删除职位
hrRouter.get('/hr/delPosition', (req, res) => {
  const { position_id } = req.query
  const del_sql = `delete from pos where position_id = '${position_id}'`
  const orderNumSql = "select max(id) as num from pos"
  query(del_sql, (result) => {
    query(orderNumSql, (result2) => {
      const orderNum = result2[0].num
      const sql = `alter table pos AUTO_INCREMENT=${orderNum + 1}`
      query(sql, (result3) => {
        if (result.affectedRows === 1) {
          // const sql = 'alter table '
          res.status(200).send({
            code: 200,
            msg: '删除成功',
            data: null
          })
        } else {
          return returnErr(res, '删除失败')
        }
      })
    })
  })
})

// hr职位信息
hrRouter.get('/hr/editPosition', (req, res) => {
  const { position_id } = req.query;
  const sql = `select position_name, salary, cityName, pos_region, position_type1, position_type2, experiences, degrees, welfare_tag, position_desc, job_type from pos where position_id = '${position_id}'`
  query(sql, (result) => {
    if (result.length) {
      res.status(200).send({
        code: 200,
        msg: '查询成功',
        data: result[0]
      })
    } else {
      return returnErr(res, '查询失败')
    }
  })
})

// hr编辑职位信息
hrRouter.post('/hr/editPositionR', (req, res) => {
  const { formData, position_id } = req.body
  const sql = `update pos set
                  updateTime='${new Date().toLocaleString().replaceAll('/', '-')}', 
                    position_name='${formData.position_name}', 
                    salary='${formData.salary}',
                    cityName='${formData.cityArr[1]}',
                    pos_region='${formData.cityArr[2]}',
                    experiences='${formData.experiences}',
                    degrees='${formData.degrees}',
                    position_desc='${formData.position_desc}',
                    position_type1='${formData.position_type[0]}',
                    position_type2='${formData.position_type[1]}',
                    job_type='${formData.job_type}',
                    position_state='0',
                    position_tag='${JSON.stringify([
    formData.experiences,
    formData.degrees,
  ])}',
                    welfare_tag='${JSON.stringify(
    formData.welfare_tag
  )}' where position_id='${position_id}'`;
  query(sql, (result) => {
    if (result.affectedRows >= 1) {
      res.status(200).send({
        code: 200,
        data: null,
        msg: '职位信息更新成功'
      });
    } else {
      return returnErr(res, "职位信息更新失败");
    }
  })
})





//hr绑定公司(企业端)
hrRouter.post('/hr/add/company', (req, res) => {
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
    'hr_id'
  ]

  for (let i in req.body) {
    if (!allowArr.includes(i)) {
      return returnErr(res, '参数错误')
    }
  }

  let saveHr_id = req.body.hr_id
  delete req.body.hr_id

  let key = ''
  let value = ''
  for (let i in req.body) {
    key += `,${i}`
    value += `,'${req.body[i]}'`
  }
  const company_id = uuidv4()
  const sql = `insert into company(company_id ${key}) values('${company_id}' ${value})`
  const sql1 = `update hr set company_id = '${company_id}' where hr_id = '${saveHr_id}'`
  // console.log(req.body)
  // console.log('sql',sql)
  // console.log('sql1',sql1)
  query(sql, (result) => {
    if (result.affectedRows >= 1) {
      query(sql1, (result1) => {
        if (result1.affectedRows >= 1) {
          res.status(200).send({
            code: 200,
            data: null,
            company_id,
            hr_id:saveHr_id,
            msg: '绑定公司成功'
          });
        } else {
          return returnErr(res, "绑定公司失败");
        }
      })

    } else {
      return returnErr(res, "绑定公司失败");
    }
  })
})


//通过人事id获取公司信息(企业端)
hrRouter.post('/hr/company/info', (req, res) => {
  const {company_id} = req.body
  if(!company_id) return returnErr(res, '参数错误')
  const sql = `select * from company where company_id = '${company_id}'`
  query(sql,result=>{
    res.send({
      code:200,
      msg:"查询成功",
      data:result
    })
  })
 
})

//获取人事信息(企业端)
hrRouter.post('/hr/info', (req, res) => {
  const {hr_id} = req.body
  if(!hr_id) return returnErr(res, '参数错误')
  const sql = `select * from hr where hr_id = '${hr_id}'`
  query(sql,result=>{
    const RES = result?.map(item => {
      if (item.password) {
        delete item.password
      }
      return item
    })
    res.send({
      code:200,
      msg:"查询成功",
      data:RES
    })
  })
 
}) 


//获取人事状态(企业端)
hrRouter.get('/hr/state', (req, res) => {
  let { hr_id } = req.query
  if (!hr_id) return returnErr(res, '参数错误')
  const sql = `select hr_state from hr  where hr_id='${hr_id}' `
  query(sql, result => {
    res.status(200).send({ code: 200, msg: 'ok', state:result[0].hr_state})
  })
})


//修改人事(企业端)
hrRouter.patch('/hr/info', (req, res) => {
  let { hr_id, name, password, telephone, avatar,hr_identity } = req.body
  if ( !telephone || !name || !hr_id || !hr_identity) return returnErr(res, '参数错误')
  let str = ''
  if (avatar) {
    str = `,avatar = '${avatar}'`
  } else {
    str = ''
  }
  let sql = ''
  if (password) {
    sql = `update hr set name = '${name}', hr_identity = '${hr_identity}',
    telephone = '${telephone}',password = '${password}' ${str}
    where hr_id = '${hr_id}'`
  } else {
    sql = `update hr set name = '${name}', hr_identity = '${hr_identity}',
    telephone = '${telephone}' ${str}
        where hr_id = '${hr_id}'`
  }

  query(sql, result => {
    if (result.affectedRows >= 1) {
      res.send({ code: 200, msg: '修改成功', data: null})
    } else {
      return returnErr(res, '修改失败')
    }
  })
})


//hr选择绑定公司(企业端)
hrRouter.post('/hr/build/company', (req, res) => {
  const {hr_id,company_id} = req.body
  const sql = `update hr set company_id = '${company_id}' where hr_id = '${hr_id}' `
  query(sql, result => {
    if (result.affectedRows >= 1) {
      res.send({ code: 200, msg: '绑定公司成功', data: null})
    } else {
      return returnErr(res, '绑定公司失败')
    }
  })
})
module.exports = hrRouter