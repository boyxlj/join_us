import {defineStore} from 'pinia'
import {getPositionHotSearchList} from "../../api"
import { message } from 'ant-design-vue'
export const useHotSearchPosition = defineStore('hotSearchPosition',{
  state:()=>{
    return {
      hotSearchPositionList:[]
    }
  },
  actions:{
   async getData(){
   const res:any = await getPositionHotSearchList() 
   if(res.code!==200){
    message.error('数据请求异常')
    this.hotSearchPositionList = []
    return
   }else{
    this.hotSearchPositionList  = res.data
   }
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