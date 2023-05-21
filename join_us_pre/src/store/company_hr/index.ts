import {defineStore} from "pinia"
import {selectCompanyInfo} from "../../api"
import { message } from "ant-design-vue"
export const useCompanyInfo = defineStore('companyInfo',{
  state:()=>{
    return {
      companyInfoList:[],
      company_id:'',
    }
  },
  actions:{
    //获取公司信息
    async getCompanyInfo(company_id:string){
      const res:any  = await selectCompanyInfo(company_id?company_id:this.company_id)
       if(res.code!=200) {
        message.error("数据请求异常")
          this.companyInfoList=[]
        return
      } 
      this.companyInfoList=res.data
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

    //保存公司id
    saveCompanyId(company_id:string){
      this.company_id = company_id
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