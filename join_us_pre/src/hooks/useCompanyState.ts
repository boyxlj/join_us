const state = ref(false)
const sateValue = ref(0)
import {message} from "ant-design-vue"
import {useCompanyInfo} from "@/store/company_hr"
import {selCompanyState} from "@/api"
const company_id = useCompanyInfo().company_id
export const useCompanyState =async (flag?:boolean) => {
  const res:any = await selCompanyState(company_id)
  sateValue.value = res.state*1
  if (res.state==0) {
    if(!flag){
        message.warning("您提交的公司信息正在审核中,暂无法进行修改")
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