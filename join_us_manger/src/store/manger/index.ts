import {defineStore} from "pinia"
import {selMangerOne} from '@/api'
export const useMangerStore = defineStore('manger',{
  state:()=>{
    return {
      manger_id:'',
      mangerInfo:[]
    }
  },
  actions:{
    async getManger(){
      const res:any = await selMangerOne(this.manger_id)
      if(res.code==200){
        this.mangerInfo = res.data
      } 
    },
    async saveMangerId(manger_id:string){
      this.manger_id = manger_id
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
