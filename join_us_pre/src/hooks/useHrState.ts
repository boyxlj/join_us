const state = ref(false)
const sateValue = ref(0)
import {message} from "ant-design-vue"
import {selHrState} from "@/api"
import {useHrInfo} from "@/store/hr"

const hr_id = useHrInfo().hr_id
export const useHrState =async(flag?:boolean) => {
  const res:any = await selHrState(hr_id)
  sateValue.value = res.state*1
  if (res.state==0) {
    if(!flag){
        message.warning("您的账号异常，暂无法进行操作")
    }
    state.value = false
  } else {
    state.value = true
  }
  return {
    state:state.value,
    sateValue:sateValue.value,
  }
}