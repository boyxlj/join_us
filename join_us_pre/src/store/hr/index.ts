import {defineStore} from "pinia"
import {selectHrInfo} from "../../api"
import { message } from "ant-design-vue"
import {IHrData} from "@/types/hr"
export const useHrInfo = defineStore('hrInfo',{
  state:()=>{
    return {
      hrInfoList:[] as IHrData[],
      hr_id:'',
    }
  },
  actions:{
    //获取公司信息
    async getHrInfo(hr_id:string){
      const res:any  = await selectHrInfo(hr_id?hr_id:this.hr_id)
      if(res.code!=200) {
        message.error("数据请求异常")
          this.hrInfoList=[]
        return
      } 
      this.hrInfoList=res.data
    },

    // //修改用户信息
    // async updateUseInfo(data:any){
    //   const res:any  = await updateUser({...data,userId:this.userId})
    //   if(res.code!==200) {
    //     message.error("修改失败")
    //     return Promise.reject(400)
    //   } 
    //   message.success("修改成功")
    //   this.getUseInfo(this.userId)
    //   return Promise.resolve(200)
     
    // },

    //保存人事id
    saveHrId(hr_id:string){
      this.hr_id = hr_id
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