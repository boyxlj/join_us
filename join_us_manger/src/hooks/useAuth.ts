import { Message } from "@arco-design/web-vue"
import { useMangerStore } from "@/store/manger"
import { IMangerData } from "@/types/manger"
import { computed } from 'vue'
//show 为true时message提示
export const useAuth = (show: boolean = true) => {
  const flag = ref(false)
  const mangerInfo = computed(() => useMangerStore().mangerInfo[0] as IMangerData)
  if (!mangerInfo.value.manger_state || mangerInfo.value.manger_state !== '1') {
    if (show) {
      Message.error("您没有权限进行当前操作")
    }
    flag.value = false
  } else {
    flag.value = true
  }
  return flag.value
}