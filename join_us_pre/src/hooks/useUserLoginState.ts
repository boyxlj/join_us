const state = ref(false)
import {message} from "ant-design-vue"
export const useUserLoginState = (flag?:boolean) => {
  const res = localStorage.getItem('token')
  if (!res) {
    if(!flag){
      message.warning("请先登录后再进行操作")
    }
    state.value = false
  } else {
    state.value = true
  }
  return state.value
}