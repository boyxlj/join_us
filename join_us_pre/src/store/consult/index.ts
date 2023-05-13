import { defineStore } from "pinia"
import {selectConsultCategory} from "@/api"
export const useConsult = defineStore('consult', {
  state:()=>{
    return {
      consultCategoryData:[]
    }
  },
  actions:{
    async getConsultCategory(){
      const res:any  =await  selectConsultCategory()
      if(res.code!==200) {
        return Promise.reject(400)
      } 
      this.consultCategoryData = res.data
      return Promise.resolve(200)
     
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