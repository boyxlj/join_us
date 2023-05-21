import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { message } from 'ant-design-vue'
const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  timeout: 5000
})

request.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  const companyToken = localStorage.getItem('companyToken')
  
  if (token!=='null' && token ) {
    config.headers.Authorization = token
  }
  if (companyToken && token!=='null' ) {
    config.headers.Authorizations = companyToken
  }
  return config
})

request.interceptors.response.use((response): any => {
  const token = response.headers.authorization
  const tokens = response.headers.authorizations
  const tokenLocal = localStorage.getItem('token')
  if (token && token!=='null') {
    if (tokenLocal && tokenLocal!=='null' ) {
      localStorage.setItem("token", token)
    } else {
      if (tokens && tokens!=='null') {
        localStorage.setItem("companyToken", tokens)
      }
    }
  }
  if (tokens && tokens!=='null') {
    localStorage.setItem("companyToken", tokens)
  }


  if (response.data.code == 401) {
    if (!location.href.includes('/login')) {
      // return authError()
    }
    // Message.clear()
    // return Message.warning('token不存在或已失效',)
  }
  if (response.status === 200) {
    return response.data
  } else {
    // Message.error(response.data.msg,)
  }

})

export default <T>(config: AxiosRequestConfig) => {
  return request(config).then(res => {
    return res
  })
}