import request from '@/api/request'
export const userLoginReq = (data: Record<string, string>) => {
    return request({
        url: '/userLogin',
        method: 'post',
        data: data
    })
}

export const companyLoginReq = (data: Record<string, string>) => {
    return request({
        url: '/companyLogin',
        method: 'post',
        data: data
    })
}

export const register = (data: Record<string, string>) => {
    return request({
        url: '/register',
        method: 'post',
        data: data
    })
}