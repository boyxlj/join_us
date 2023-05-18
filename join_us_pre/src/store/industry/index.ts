import {defineStore} from "pinia"
import {selectIndustry} from "../../api"
import { message } from "ant-design-vue"
export const useIndustryStore = defineStore('industry',{
  state:()=>{
    return {
      industryList:[]
    }
  },
  actions:{
    async getIndustry(){
      const res:any  = await selectIndustry()
      if(res.code!=200) {
        message.error("数据请求异常")
          this.industryList=[]
        return
      } 
      this.industryList=res.data
    },
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