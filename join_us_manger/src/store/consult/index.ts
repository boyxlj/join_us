import {defineStore} from "pinia"
import {selectConsultCategory} from '@/api'
export const useConsultStore = defineStore('consultCategoryData',{
  state:()=>{
    return {
      consultCategoryData:[]
    }
  },
  actions:{
    async getConsultCategory(){
      const res:any = await selectConsultCategory()
      if(res.code==200){
        this.consultCategoryData = res.data
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
  },
})
