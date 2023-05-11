import request from '@/api/request'
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