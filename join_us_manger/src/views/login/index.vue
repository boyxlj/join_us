<template>
  <div class="login">
    <div class="box">
      <h1>招聘后台管理</h1>
      <a-form
        ref="formRef"
        size="large"
        :model="form"
        class="form"
        @submit="handleSubmit"
      >
       
        <a-form-item
          field="username"
          hide-asterisk
          :rules="[
            { required: true, message: '登录账号不能为空' },
            { minLength: 6, message: '登录账号最少为6位' },
            { maxLength: 16, message: '登录账号最多为16位' },
          ]"
          :validate-trigger="['change', 'input']"
        >
          <a-input
            v-model.trim="form.username"
            placeholder="请输入登录账号"
          />
        </a-form-item>
        <a-form-item
          field="password"
          hide-asterisk
          :rules="[
            { required: true, message: '登录密码不能为空' },
            { minLength: 6, message: '登录密码最少为6位' },
            { maxLength: 16, message: '登录密码最多为16位' },
          ]"
          :validate-trigger="['change', 'input']"
        >
          <a-input
            v-model.trim="form.password"
            type="password"
            placeholder="请输入登录密码"
          />
        </a-form-item>
        <a-form-item
          field="coderInputValue"
          hide-asterisk
          :rules="[
            { required: true, message: '验证码不能为空' },
          ]"
          :validate-trigger="['change', 'input']"
        >
          <a-input
            v-model.trim="form.coderInputValue"
            placeholder="请输入验证码"
          />
          <div @click="changeCode" class="coder" ref="coderContainer"></div>
        </a-form-item>
        <a-form-item  class="loginBtnItem">
          <a-space>
            <a-button :disabled="loginBtnDisAbled" class="loginBtn" type="primary" html-type="submit">登录</a-button>
            <!-- <a-button @click="$refs.formRef.resetFields()">Reset</a-button> -->
          </a-space>
        </a-form-item>
      </a-form>
      
      <!-- <div class="footerBox"><Footer :ba="true" :Copyright="false"/></div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { getValidateCoder } from "validate-coder";
import Footer from "@/components/common/footer/index.vue"
import {loginManger} from "@/api"
import {useMangerStore} from "@/store/manger"
import { Message } from "@arco-design/web-vue";
const formRef = ref()
const router = useRouter()
const loginBtnDisAbled= ref(false)
const handleSubmit = async({ values, errors }:any) => {
  const resArr = [];
  for (let i in errors) {
    resArr.push(i);
  }
  if (resArr.length) return
  if(values.coderInputValue!==validateCoder.value){
    Message.error("验证码不正确")
    changeCode()
    return 
  }
  loginBtnDisAbled.value = true
  const res:any  = await loginManger(values)
  if(res.code!==200){
    Message.error(res.msg)
    changeCode()
    loginBtnDisAbled.value = false
    return
  }else{
    Message.success(res.msg)
  }
  loginBtnDisAbled.value = false
  useMangerStore().saveMangerId(res.manger_id)
  useMangerStore().getManger()
  localStorage.setItem('mangerToken',res.mangerToken)
  router.push('/')
};
const coderContainer = ref<HTMLDivElement>();
  const validateCoder = ref<string>();
 //生成或更新验证码
 const changeCode = () => {
    validateCoder.value = getValidateCoder(
      coderContainer.value as HTMLDivElement,'#c9e4e8'
    );
  };

  onMounted(()=>{
    changeCode()
  })

const form = reactive({
  username:"666666",
  password:"666666",
  coderInputValue:""
})
</script>

<style lang="less" scoped>
.login {
  background: url("../../assets/images/login-bg.png") no-repeat center center;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  .box {
    width: 470px;
    height: 437px;
    background-color: #fff;
    border-radius: 24px;
    box-shadow: 0 2px 8px 0 rgba(203, 212, 221, 0.25);
    padding: 40px 40px 32px;
    text-align: center;
    padding: 15px 30px;
    box-sizing: border-box;
    position: relative;
    .footerBox{
      width: 100%;
      left: 50%;
      position: absolute;
      bottom: 43px;
      transform: translateX(-50%);
    }
    h1{
      font-weight: normal;
      font-size: 35px;
      margin-top: 25px;
    }
    .form{
      display: flex;
      justify-content: center;
      text-align: center;
      width: 115% !important;
      margin-left: -75px;
      margin-top: 30px;
      .arco-form-item{
        text-align: center;
        width: 100% !important;
        padding-bottom: 8px;
        .coder{
          width: 200px;
          height: 36px;
          background: #d7ecef;
          margin-left: 5px;
        }
      }
    }
  }
}
.loginBtnItem{
  width: 500px;
}
.loginBtn{
  width: 372px;
}
</style>
