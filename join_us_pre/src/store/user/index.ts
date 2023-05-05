import {defineStore} from "pinia"
import {getUser,updateUser} from "../../api"
import { message } from "ant-design-vue"
export const useUserInfo = defineStore('userInfo',{
  state:()=>{
    return {
      loginState:false,
      userInfoList:[],
      resumeList:[],
      userId:'',
      userInfo:{
        token:'',
        avatar:'https://img.bosszhipin.com/boss/avatar/avatar_15.png',
        nickName:'Miraitowa',
        age:'22',
        telephone:'188127666666',
        scroll:'家里蹲大学',
        email:'x709500@163.com',
        userId:'666',
      }
    }
  },
  actions:{
    changeLoginState(){
      this.loginState = true
    },
    async getUseInfo(userId:string){
      const res:any  = await getUser(userId)
      console.log(res)
      if(res.code!=200) {
        message.error("数据请求异常")
          this.userInfoList=[]
        this.resumeList=[]
        return
      } 
      this.userInfoList=res.data.userInfo
      this.resumeList=res.data.resumeData
    },
    async updateUseInfo(data:any){
      const res:any  = await updateUser({...data,userId:this.userId})
      if(res.code!==200) {
        message.error("修改失败")
        return Promise.reject(400)
      } 
      message.success("修改成功")
      this.getUseInfo(this.userId)
      return Promise.resolve(200)
     
    },
    saveUserId(userId:string){
      this.userId = userId
    }
    ,
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