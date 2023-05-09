import {defineStore} from "pinia"
import {getUser,updateUser,allSendNum} from "../../api"
import { message } from "ant-design-vue"
export const useUserInfo = defineStore('userInfo',{
  state:()=>{
    return {
      loginState:false,
      userInfoList:[],
      resumeList:[],
      userId:'',
      sendNum:{
        sendAllNum: 0,
        sendOkNum: 0,
        sendErrNum: 0,
        collectNum: 0
      }
    }
  },
  actions:{
    changeLoginState(){
      this.loginState = true
    },
    async getUseInfo(userId:string){
      const res:any  = await getUser(userId)
      if(res.code!=200) {
        message.error("数据请求异常")
          this.userInfoList=[]
        this.resumeList=[]
        return
      } 
      this.userInfoList=res.data.userInfo
      this.resumeList=res.data.resumeData
      this.getAllSendNum()
      
    },

    //修改用户信息
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

    //查询用户所有投递状态(数量)
    async getAllSendNum (){
      const res:any  = await allSendNum(this.userId)
      if(res.code!==200) {
        return Promise.reject(400)
      } 
      this.sendNum.collectNum = res.data.sendNum.collectNum
      this.sendNum.sendOkNum = res.data.sendNum.sendOkNum
      this.sendNum.sendErrNum = res.data.sendNum.sendErrNum
      this.sendNum.sendAllNum = res.data.sendNum.sendAllNum
      return Promise.resolve(200)
     
    },


    //保存用户id
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