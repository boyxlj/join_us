const positionTypeRouter = require("express").Router()
const query = require('../../utils/mysql')
const { returnErr } = require('../../utils/returnErr')
const { v4: uuidv4 } = require('uuid');
const jwt = require('../../utils/jsonwebtoken')



//添加职位类型
positionTypeRouter.post('/positionType', (req, res) => {
  let { type_name, others, parent, manger_id } = req.body
  if (!type_name || !manger_id) return returnErr(res, '参数错误')
  let regSql = ''
  const selSql = `select * from position_type where type_name = '${type_name}'  `
  if (!parent) {
    parent = null
  }
  regSql = `insert into position_type(type_name,others,parent,position_type_id,manger_id) values(
      '${type_name}','${others}','${parent}','${uuidv4()}','${manger_id}'
      ) `
  query(selSql, (selRes) => {
    if (selRes.length) {
      return returnErr(res, '该职位类型已存在，请勿重复添加')
    }
    query(regSql, (regRes) => {
      if (regRes.affectedRows >= 1) {
        res.send({ code: 200, msg: '添加职位类型', data: null })
      } else {
        return returnErr(res, '添加职位类型')
      }
    })
  })
})

//查询一级职位类型(无分页)
positionTypeRouter.get('/positionTypes/show', (req, res) => {
 const  selSql = `select  * from position_type where parent ='null' order by id desc  `
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
    })
  })
})

//查询所有职位类型
positionTypeRouter.get('/positionTypes', (req, res) => {
  let { pageOn, pageSize, type,keyword,parent } = req.query
  if (!pageSize || !pageOn) return returnErr(res, '参数错误')
  if (pageSize > 15) {
    pageSize = 15
  }
  let selAllSql = ''
  let selSql = ''
  let str = ''
  if(keyword||parent){
    if(keyword){
      str = ` and position_type.type_name like '%${keyword}%'`
    }else{
      str = ''
    }
    if(parent){
      if(str.includes('and')){
        str+=` and position_type.parent = '${parent}'`
      }else{
        str = ` and position_type.parent = '${parent}'`
      }
      
    }else{
      // str = ''
    }
  }else{
    str=''
  }
  if (type === 'category2') {
    selSql = `select  * from position_type inner join manger on position_type.manger_id=manger.manger_id where position_type.parent is not null ${str} order by  position_type.id desc limit ${(pageOn - 1) * pageSize} ,${pageSize} `
    selAllSql = `select count(*) from position_type  inner join manger on position_type.manger_id=manger.manger_id where position_type.parent is not null ${str}`
  } else {
    selAllSql = `select count(*) from position_type  inner join manger on position_type.manger_id=manger.manger_id where position_type.parent ='null' ${str}`
    selSql = `select  * from position_type inner join manger on position_type.manger_id=manger.manger_id where position_type.parent ='null' ${str} order by  position_type.id desc limit ${(pageOn - 1) * pageSize} ,${pageSize} `
  }
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


//删除职位类型
positionTypeRouter.delete('/positionType', (req, res) => {
  const { position_type_id, type } = req.body
  if (!position_type_id) return returnErr(res, '参数错误')
  let selAllSql = ''
  let selSql = ''
  if (type === 'category2') {
    selSql = `delete from position_type where position_type_id = '${position_type_id}' `
    query(selSql, (selRes) => {
      if (selRes.affectedRows >= 1) {
        res.send({ code: 200, msg: '删除职位类型成功', data: null })
      } else {
        return returnErr(res, '删除职位类型失败')
      }
    })
  } else {
    selSql = `delete from position_type where position_type_id = '${position_type_id}' `
    selAllSql = `delete from position_type where parent = '${position_type_id}' `
    query(selSql, (selRes) => {
      query(selAllSql, (selAllRes) => {
        if (selRes.affectedRows >= 1) {
          res.send({ code: 200, msg: '删除职位类型成功', data: null })
        } else {
          return returnErr(res, '删除职位类型失败')
        }
      })
    })
  }

})



//修改职位类型
positionTypeRouter.patch('/positionType', (req, res) => {
  let { type_name, position_type_id, others } = req.body
  if (!type_name || !position_type_id) return returnErr(res, '参数错误')
  let sql = `update position_type set type_name = '${type_name}',
  others = '${others}' where position_type_id = '${position_type_id}'`
  query(sql, result => {
    if (result.affectedRows >= 1) {
      res.send({ code: 200, msg: '修改成功', data: null })
    } else {
      return returnErr(res, '修改失败')
    }
  })
})

module.exports = positionTypeRouter