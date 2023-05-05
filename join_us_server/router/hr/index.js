const express = require("express")
const hrRouter = express.Router()
const query = require('../../utils/mysql')
const { v4: uuidv4, v4 } = require("uuid");
const jwt = require("../../utils/jsonwebtoken");
const { returnErr } = require("../../utils/returnErr");
//人事表

hrRouter.get('/',(req,res)=>{
  res.send({code:200,msg:'ok'})
})

// hr登陆或注册
hrRouter.post('/hr/LoginOrRegister', (req, res) => {
  const { telephone, password } = req.body
  const time = new Date().toLocaleString()
  const hr_id = v4()
  const queryHrSQl = `select * from hr where telephone = '${telephone}'`
  query(queryHrSQl, (result) => {
    if (result.length) {
      return res.send({
        code: 200,
        msg: '企业登录成功',
        data: null,
        company_id: result[0].company_id,
        token: jwt.sendToken({telephone}, '1day')
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
              remark: '该用户为首次注册',
              token: jwt.sendToken({telephone}, '1day')
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
    const sql = `select * from pos where company_id = '${company_id}' limit ${(pageIndex - 1) * pageSize}, ${pageSize}`
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
      return returnErr(res, '请求失败')
    }
  })
})

// hr发布职位
hrRouter.post("/hr/addPosition", (req, res) => {
  const { company_id, telephone, formData } = req.body
  const hr_id_sql = `select hr_id from hr where telephone = '${telephone}'`
  query(hr_id_sql, (result) => {
    const hr_id = result[0].hr_id
    const orderNumSql = 'select count(*) as num from pos'
    query(orderNumSql, (result2) => {
      const orderNum = result2[0].num
      const sql = `insert into pos values(${orderNum + 1}, '${v4()}', '${formData.position_name}', '${formData.salary}', '${formData.cityArr[1]}', '${formData.cityArr[2]}', '${formData.experiences}', '${formData.degrees}',  '${JSON.stringify([formData.experiences, formData.degrees])}', '${JSON.stringify(formData.welfare_tag.split(','))}', '${company_id}', '${hr_id}', '${formData.position_desc}', '${new Date().toLocaleString()}', '${new Date().toLocaleString()}', '0', '${formData.position_type[0]}', '${formData.position_type[1]}', '${formData.job_type}')`
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
  query(del_sql, (result) => {
    if (result.affectedRows === 1) {
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
  console.log(position_id, formData);
  const sql = `update pos set
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
                    position_tag='${JSON.stringify([
											formData.experiences,
											formData.degrees,
										])}',
                    welfare_tag='${JSON.stringify(
											formData.welfare_tag.split(",")
										)}',
                    updateTime='${new Date().toLocaleString()}' where position_id='${position_id}'`;
  query(sql, (result) => {
    if (result.affectedRows > 0) {
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
module.exports = hrRouter