import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { Message, Modal } from '@arco-design/web-vue';
import router from '@/router';
const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  timeout: 5000
})
request.interceptors.request.use(config => {
  const mangerToken = localStorage.getItem('mangerToken')
  if (mangerToken) {
    config.headers.Authorization = mangerToken
  }
  return config
})
function debounce(fn: any, wait: any) {
  let timerId = null;
  let flag = true;
  return function () {
    if (flag) {
      fn.apply(debounce, arguments);
      flag = false;
      timerId = setTimeout(() => {
        flag = true;
      }, wait);
    }
  };
}
const authError = debounce(
  () => {
    Modal.warning({ 
      simple: true, hideCancel:false,title: "温馨提示", content: "您的登录信息已经过期，请选择是否重新登录？",
      okText:"跳转登录",
      cancelText:"取消",
      onOk(e) {
        localStorage.clear()
        if(!location.href.includes('/login')){
          // router.replace(`/login`)
          location.reload()
        }
      },
     })
  }, 1000);
  request.interceptors.response.use((response): any => {
  const mangerToken = response.headers.authorization
  if (mangerToken) {
    localStorage.setItem("mangerToken", mangerToken)
  }

  if (response.data.code == 401) {
    if(!location.href.includes('/login')){
      return authError()
    }
    // Message.clear()
    // return Message.warning('token不存在或已失效',)
  }
  if (response.status === 200) {
    return response.data
  } else {
    Message.error(response.data.msg,)
  }


})

export default <T>(config: AxiosRequestConfig) => {
  return request(config).then(res => {
    return res
  })
}