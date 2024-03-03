import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { message } from 'ant-design-vue'
import router from '@/router'
const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL
})

request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  const companyToken = localStorage.getItem('companyToken')

  if (token !== 'null' && token) {
    config.headers.Authorization = token
  }
  if (companyToken && token !== 'null') {
    config.headers.Authorizations = companyToken
  }
  return config
})

request.interceptors.response.use((response): any => {
  const token = response.headers.authorization
  const tokens = response.headers.authorizations
  const tokenLocal = localStorage.getItem('token')
  if (token && token !== 'null') {
    if (tokenLocal && tokenLocal !== 'null') {
      localStorage.setItem('token', token)
    } else {
      if (tokens && tokens !== 'null') {
        localStorage.setItem('companyToken', tokens)
      }
    }
  }
  if (tokens && tokens !== 'null') {
    localStorage.setItem('companyToken', tokens)
  }
  if (response.data.code == 401) {
    message.destroy()
    message.warning('您的登录信息已过期,请你重新登录')
    localStorage.removeItem('token')
    localStorage.removeItem('companyToken')
    if (location.href.includes('/home')) {
      router.push('/login')
    } else {
      router.push('/login?query=boss')
    }
    return
  }
  if (response.status === 200) {
    return response.data
  } else {
    // Message.error(response.data.msg,)
  }
})

export default <T>(config: AxiosRequestConfig) => {
  return request(config).then((res) => {
    return res
  })
}
