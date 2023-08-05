<template>
  <div class="login">
    <div class="box">
      <h1>验证码登录/注册</h1>
      <div class="tabs">
        <li @click="changeActive(0)" :class="activeKey === 0 ? 'active' : ''">
          我要找工作
        </li>
        <li @click="changeActive(1)" :class="activeKey === 1 ? 'active' : ''">
          我要招聘
        </li>
      </div>
      <div class="formBox">
        <a-form
          class="form"
          ref="formRef"
          name="custom-validation"
          :model="formState"
          :rules="rules"
          v-bind="layout"
          @finish="handleFinish"
          @validate="handleValidate"
          @finishFailed="handleFinishFailed"
        >
          <a-form-item v-if="activeKey === 0" name="email">
            <a-input
              v-model:value="formState.email"
              type="text"
              autocomplete="off"
              placeholder="请输入您的邮箱"
            />
          </a-form-item>
          <a-form-item v-if="activeKey === 1" name="username">
            <a-input
              v-model:value="formState.username"
              type="text"
              autocomplete="off"
              placeholder="请输入您的手机号"
            />
          </a-form-item>
          <a-form-item v-if="activeKey === 1" name="psd">
            <a-input
              v-model:value="formState.psd"
              type="password"
              autocomplete="off"
              placeholder="请输入您的登录密码"
            />
          </a-form-item>

          <a-form-item class="sendCode" v-if="activeKey === 0" name="code">
            <a-input
              v-model:value="formState.code"
              type="text"
              autocomplete="off"
              placeholder="验证码"
            />
            <a-button
              :disabled="disabledSendCodeBtn"
              class="sendCodeBtn"
              @click="clickSendCode"
              >{{ sendCodeBtnText }}</a-button
            >
          </a-form-item>

          <a-form-item
            class="coders"
            name="inputCodeValue"
            v-show="activeKey === 1"
          >
            <a-input
              v-model:value="formState.inputCodeValue"
              placeholder="请输入数字验证码"
            />
            <div class="photo" @click="refresh()" ref="validateContainer"></div>
          </a-form-item>
          <a-form-item class="tipsItem" >
            <p class="loginTips"  >
               如果您的账号未进行注册，首次登录后系统将会自动为您注册！
            </p>
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 24, offset: 0 }">
            <a-button
              class="submitBtn"
              style="width: 100%"
              type="primary"
              @click="submit"
              :disabled="disabledSubmit"
              >登录/注册</a-button
            >
          </a-form-item>
        </a-form>
      </div>
    </div>
    <CompanyApply />
  </div>
</template>

<script setup lang="ts">
import { notification, message } from "ant-design-vue";
import type { Rule } from "ant-design-vue/es/form";
import type { FormInstance } from "ant-design-vue";
import { getValidateCoder } from "validate-coder";
import { userSendCode, userLogin, hrLoginOrRegister } from "@/api";
import { useUserInfo } from "@/store/user";
import { useCompanyInfo } from "@/store/company_hr";
import { useHrInfo } from "@/store/hr";
import CompanyApply from "@/components/companyApply/index.vue";
import { emitter } from "@/utils/emitter";
const router = useRouter();
const route = useRoute();
interface FormState {
  email: string;
  code: string;
  username: string;
  psd: string;
  inputCodeValue?: string;
}

const activeKey = ref(0);
const validateCoder = ref<string>();

onMounted(() => {
  if (route.query?.query === "boss") {
    activeKey.value = 1;
    document.title = "企业登录";
  } else {
    activeKey.value = 0;
  }
});

// const inputCodeValue = ref<string>();
const validateContainer = ref<HTMLDivElement>();
const changeActive = (actIdx: number) => {
  if (activeKey.value === actIdx) return;
  // const token = localStorage.getItem('token')
  // if(token && activeKey.value==1) return
  activeKey.value = actIdx;
  if (activeKey.value == 0) {
    router.replace("/login");
  } else {
    router.replace("/login?query=boss");
  }
  formRef.value?.resetFields();
  refresh();
};

const disabledSubmit = ref(false);
//验证码按钮
const sendCodeBtnText = ref("发送验证码");
const disabledSendCodeBtn = ref(false);
const clickSendCode = async () => {
  await formRef.value?.validate(["email"]);
  disabledSendCodeBtn.value = true;
  const res: any = await userSendCode(formState.email);
  if (res.code === 200) {
    notification.success({
      message: "验证码发送成功，请注意查收",
    });
    let timeout = 60;
    let timer = setInterval(() => {
      timeout--;
      if (timeout === 0) {
        clearInterval(timer);
        disabledSendCodeBtn.value = false;
        return (sendCodeBtnText.value = "发送验证码");
      }
      sendCodeBtnText.value = `${timeout}后再次尝试发送`;
    }, 1000);
  } else {
    disabledSendCodeBtn.value = false;
    notification.error({
      message: "验证码发送失败",
    });
  }
};

//更新验证码
const refresh = () => {
  validateCoder.value = getValidateCoder(
    validateContainer.value as HTMLDivElement,
    "#BCDEEA"
  );
};

onMounted(() => {
  refresh();
});

const formRef = ref<FormInstance>();
const formState = reactive<FormState>({
  code: "",
  email: "",
  username: "13870000000",
  psd: "123456",
  inputCodeValue: "",
});

let validateEmailCode = async (_rule: Rule, value: string) => {
  if (value === "") {
    return Promise.reject("请填写验证码");
  } else {
    if (formState.code !== "") {
      formRef.value?.validateFields("checkPass");
    }
    return Promise.resolve();
  }
};
let validateEmail = async (_rule: Rule, value: string) => {
  const reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
  if (value === "") {
    return Promise.reject("请填写您的邮箱");
  } else if (!reg.test(formState.email)) {
    return Promise.reject("请输入合法的邮箱");
  } else {
    return Promise.resolve();
  }
};
let validateUserName = async (_rule: Rule, value: string) => {
  const reg =
    /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
  if (value === "") {
    return Promise.reject("请填写您的手机号");
  } else if (!reg.test(formState.username)) {
    return Promise.reject("请输入正确格式的手机号");
  } else {
    return Promise.resolve();
  }
};
let validateUserPsd = async (_rule: Rule, value: string) => {
  const reg = /^[a-z0-9]+$/i;
  if (value === "") {
    return Promise.reject("请填写您的登录密码");
  } else if (!reg.test(formState.psd)) {
    return Promise.reject("密码只能由6-14位数字和字母组成");
  } else if (value.length > 14 || value.length < 6) {
    return Promise.reject("密码只能由6-14位数字和字母组成");
  } else {
    return Promise.resolve();
  }
};
let validateInputCodeValue = async (_rule: Rule, value: string) => {
  if (!value) {
    return Promise.reject("请填写数字验证码");
  } else {
    return Promise.resolve();
  }
};

const rules: Record<string, Rule[]> = {
  code: [{ required: true, validator: validateEmailCode, trigger: "change" }],
  email: [{required: true, validator: validateEmail, trigger: "change" }],
  username: [{required: true, validator: validateUserName, trigger: "change" }],
  psd: [{ required: true,validator: validateUserPsd, trigger: "change" }],
  inputCodeValue: [{required: true, validator: validateInputCodeValue, trigger: "change" }],
};
const layout = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
};
const handleFinish = (values: FormState) => {
};
const handleFinishFailed = (errors: any) => {
};

window.addEventListener("beforeunload", function (e) {
  const companyToken = localStorage.getItem("companyToken");
  const hr_id = localStorage.getItem("hr_id");
  if(companyToken && hr_id){
    localStorage.removeItem('companyToken')
  }
});

const submit = async () => {
  disabledSubmit.value = true
  if (activeKey.value == 1) {
    await formRef.value?.validateFields(["username", "psd",'inputCodeValue']);
    if (formState.inputCodeValue !== validateCoder.value) {
      refresh();
      disabledSubmit.value = false
      return message.error("验证码有误");
    }
    const res: any = await hrLoginOrRegister({
      telephone: formState.username,
      password: formState.psd,
    });
    refresh();
    if (res.code === 200) {
      localStorage.removeItem("token");
      if (res.remark || !res.company_id) {
        // 首次注册后续操作，填写表单等
        localStorage.setItem("companyToken", res.token);
        localStorage.setItem("hr_id", res.hr_id);
        localStorage.setItem(
          "loginInfo",
          JSON.stringify({ telephone: formState.username })
          );
          emitter.emit("changeCompanyState");
      } else {
        localStorage.setItem("companyToken", res.token);
        localStorage.setItem("company_id", res.company_id);
        localStorage.setItem(
          "loginInfo",
          JSON.stringify({ telephone: formState.username })
        );
        useCompanyInfo().saveCompanyId(res.company_id);
        useCompanyInfo().getCompanyInfo(res.company_id);
        useHrInfo().saveHrId(res.hr_id);
        useHrInfo().getHrInfo(res.hr_id);
        localStorage.removeItem("token")
        message.success("企业登录成功");
        // router.push('/company')
        setTimeout(() => {
          disabledSubmit.value = false
          router.push("/company");
        }, 100);
      }
    } else {
      disabledSubmit.value = false
      message.error("登录失败");
    }
  } else {
    await formRef.value?.validateFields(["email", "code"]);
    const params = { email: formState.email, validateCode: formState.code };
    const res: any = await userLogin(params);
    disabledSubmit.value = true;
    refresh();
    if (res.code != 200) {
      return message.error(res.msg);
    }
    localStorage.setItem("token", res.token);
    useUserInfo().saveUserId(res.userInfo[0]?.userId);
    useUserInfo().getUseInfo(res.userInfo[0]?.userId);
    localStorage.removeItem("companyToken");
    message.success("登录成功");
    setTimeout(() => {
      disabledSubmit.value = false
      location.reload();
    }, 1000);
  }
};

const handleValidate = (...args: any) => {};
</script>

<style lang="less" scoped>
.login {
  width: 100vw;
  height: 100vh;
  background: url("../../assets/images/login_bg.webp") no-repeat center center;
  background-size: 100% 100%;
  user-select: none;
  .reg-modal-input {
    margin: 15px 0;
  }

  .box {
    width: 580px;
    height: 600px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 5%;
    text-align: center;
    padding: 40px 20px;
    box-sizing: border-box;
    box-shadow: 0 0 10px #ddd;
    border-radius: 20px;
    background: #fff;

    h1 {
      font-size: 30px;
      margin: 20px 0 30px;
    }

    .tabs {
      width: 85%;
      height: 50px;
      margin: 0 auto;
      border-radius: var(--radiusSize);
      background: #ececec;
      padding: 4px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;

      li {
        width: 88%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: var(--radiusSize);
        user-select: none;
        cursor: pointer;
        transition: all 0.2s;
      }

      .active {
        color: var(--themeColor);
        background: #fff;
      }
    }

    .formBox {
      width: 85%;
      margin: 0 auto;
      margin-top: 40px;

      .form {
        text-align: left;

        .ant-form-item {
          padding-bottom: 6px;
         
        }
        .tipsItem{
          padding: 0;
          .loginTips{
            margin: 0;
            padding: 0;
            font-size: 13px;
            color: #939393;

          }
        }

        .sendCode {
          display: flex;
          justify-content: space-between;
          position: relative;

          .ant-input {
            width: 292px;
          }

          .sendCodeBtn {
            flex: 1;
            height: 45px;
            position: absolute;
            right: 0;
            width: 150px;
            // padding: 0 35px;
          }
        }

        .coders {
          position: relative;
          height: 100%;

          ::v-deep(.ant-form-item-explain-error) {
            margin-top: 12px !important;
          }

          .ant-input {
            height: 45px;
            position: absolute;
            left: 0;
            bottom: 0;
            right: 0;
            top: 0;
          }

          .photo {
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            width: 130px;
            border-radius: var(--radiusSize);
            text-align: center;
            height: 45px !important;
          }
        }

        .ant-input {
          height: 45px;
        }

        .submitBtn {
          height: 45px;
        }
      }
    }
  }
}
</style>
