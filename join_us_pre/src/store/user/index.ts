import {defineStore} from "pinia"

export const useUserInfo = defineStore('userInfo',{
  state:()=>{
    return {
      loginState:false,
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
    async getUseInfo(id:string){
      //
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