import {defineStore} from "pinia"
import {selectSwiper} from "../../api"
import { message } from "ant-design-vue"
export const useSwiperStore = defineStore('swiper',{
  state:()=>{
    return {
      swiperList:[]
    }
  },
  actions:{
    async getSwiper(){
      const res:any  = await selectSwiper()
      if(res.code!=200) {
        message.error("数据请求异常")
          this.swiperList=[]
        return
      } 
      this.swiperList=res.data
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