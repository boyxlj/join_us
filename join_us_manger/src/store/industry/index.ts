import {defineStore} from "pinia"
import {selIndustryAllShow} from '@/api'
export const useIndustryStore = defineStore('industry',{
  state:()=>{
    return {
      industryData:[]
    }
  },
  actions:{
    async getIndustry(){
      const res:any = await selIndustryAllShow()
      if(res.code==200){
        this.industryData = res.data
      } 
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
