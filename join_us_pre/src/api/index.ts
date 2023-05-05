import request from '@/api/request'
// 用户登陆
export const userLogin = (data:{email:string,validateCode:string}) => {
  return request({
    url: '/user/login',
    method: 'post',
    data: data
  })
}

//用户发送验证码
export const userSendCode = (email:string) => {
  return request({
    url: '/user/email/coder',
    method: 'post',
    data: {
      email
    }
  })
}

// 企业登陆
export const companyLoginReq = (data: Record<string, string>) => {
  return request({
    url: '/companyLogin',
    method: 'post',
    data: data
  })
}


//获取职位类型
export const getPositionType = () => {
  return request({
    url: '/positionType',
    method: 'get'
  })
}

//查询职位列表
export const getPositionList = (data:any) => {
  return request({
    url: '/positions',
    method: 'post',
    data,
  })
}
//查询首页搜索框热搜职位列表
export const getPositionHotSearchList = (cityName:string) => {
  return request({
    url: `/position/hot?cityName=${cityName}`,
    method: 'get'
  })
}

//查询首页热招职位列表
export const getPositionByHot = (position_type1: string) => {
  return request({
    url: `/position/hotSearch?position_type1=${position_type1}`,
    method: 'get'
  })
}
// 获取职位详情
export const getJobDetail = (position_id: string) => {
    return request({
        url: `/positionDetail`,
        method: 'get',
        params: {
            position_id: position_id
        }
    })
}

//随机排序查询职位列表  /position/by/rand?cityName=天津&num=6&isRandom=true
export const getSortOrRandomPosition = (data:{cityName:string,num?:number,isRandom?:boolean}) => {
  return request({
      url: `/position/by/rand`,
      method: 'get',
      params: data
  })
}

// hr登陆注册
export const hrLoginOrRegister = (data: { telephone: string, password: string }) => {
  return request({
    url: '/hr/LoginOrRegister',
    method: 'post',
    data: data
  })
}

// 企业端职位管理
export const hrPositionManage = (company_id: string, pageIndex: number, pageSize: number) => {
  return request({
    url: '/hr/positionManage',
    method: 'get',
    params: {
      company_id: company_id,
      pageIndex: pageIndex,
      pageSize: pageSize
    }
  })
}

// 企业端查看职位详情
export const hrPositionDetail = (position_id: string) => {
  return request({
    url: '/hr/positionDetail',
    method: 'get',
    params: {
      position_id: position_id
    }
  })
}

// hr发布职位
export const hrAddPosition = (data: Record<string, any>) => {
  return request({
    url: '/hr/addPosition',
    method: 'post',
    data: data
  })
}

// hr删除职位
export const hrDelPosition = (position_id: string) => {
  return request({
    url: '/hr/delPosition',
    method: 'get',
    params: {
      position_id: position_id
    }
  })
}

// hr修改职位
export const hrEditPosition = (position_id: string) => {
  return request({
    url: '/hr/editPosition',
    method: 'get',
    params: {
      position_id: position_id
    }
  })
}

// hr修改职位
export const hrEditPosition2 = (data: Record<string, any>) => {
  return request({
    url: '/hr/editPositionR',
    method: 'post',
    data: data
  })
}