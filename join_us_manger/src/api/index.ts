import request from '@/api/request'

//---------管理员接口
//登录
export const loginManger = (data:any) => {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

//注册
export const regManger = (data:any) => {
  return request({
    url: '/register',
    method: 'post',
    data
  })
}
//查询所有管理员
export const selMangerAll = (data:any) => {
  return request({
    url: '/mangers',
    method: 'get',
    params:data
  })
}
//查询指定管理员
export const selMangerOne = (manger_id:string) => {
  return request({
    url: '/manger_id',
    method: 'post',
    data:{manger_id}
  })
}
//修改管理员权限
export const updateMangerState = (data:any) => {
  return request({
    url: '/state',
    method: 'post',
    data,
  })
}
//修改管理员
export const updateManger = (data:any) => {
  return request({
    url: '/manger',
    method: 'patch',
    data,
  })
}
//删除管理员
export const delManger = (manger_id:string) => {
  return request({
    url: '/manger',
    method: 'delete',
    data:{manger_id},
  })
}

// ----------资讯接口
export const selectConsultCategory = () => {
  return request({
    url: '/category',
    method: 'get'
  })
}

//发布资讯
export const publishConsult = (data: { email: string, validateCode: string }) => {
  return request({
    url: '/consult',
    method: 'post',
    data
  })
}
//查询资讯
export const selectConsult = (data:any) => {
  return request({
    url: '/consults',
    method: 'get',
    params:data,
  })
}
//修改资讯状态
export const updateConsultState = (data:any) => {
  return request({
    url: '/consult/state',
    method: 'post',
    data,
  })
}
//修改资讯
export const updateConsult = (data:any) => {
  return request({
    url: '/consult',
    method: 'patch',
    data,
  })
}
//删除资讯
export const delConsult = (consult_id:string) => {
  return request({
    url: '/consult',
    method: 'delete',
    data:{consult_id},
  })
}

