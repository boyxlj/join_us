import { defineStore } from "pinia"
import {conditionList} from "../../utils/condition"
export const useGetConditionData = defineStore('condition', {
  state:()=>{
    return {
      conditionData:conditionList
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,
      },
    ],
  }
})