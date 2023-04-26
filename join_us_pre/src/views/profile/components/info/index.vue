<template>
  <div class="hoveList infoBox">
    <div class="tips">编辑个人信息</div>
    <a-form
      class="formList"
      ref="formRef"
      name="custom-validation"
      :model="formState"
      :rules="rules"
      v-bind="layout"
      @finish="handleFinish"
      @validate="handleValidate"
      @finishFailed="handleFinishFailed"
    >
      <a-form-item class="infoItem" name="name">
        <span>姓名</span>
        <a-input
          v-model:value="formState.name"
          type="text"
          autocomplete="off"
          placeholder="请填写您的姓名"
        />
      </a-form-item>
      <a-form-item class="infoItem" name="apply_state">
        <span>求职状态</span>
        <a-select v-model:value="formState.apply_state" style="width: 120px" >
          <a-select-option value="在职">在职</a-select-option>
          <a-select-option value="离职">离职</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item class="infoItem" name="gender">
        <span>性别</span>
        <a-radio-group v-model:value="gender" size="large">
        <a-radio-button value="0">男</a-radio-button>
        <a-radio-button value="1">女</a-radio-button>
      </a-radio-group>
      </a-form-item>
   
      <a-form-item class="infoItem" name="phone">
        <span>电话</span>
        <a-input
          v-model:value="formState.phone"
          type="text"
          autocomplete="off"
          placeholder="请填写您的手机号"
        />
      </a-form-item>
      <a-form-item class="infoItem" name="born">
        <span>生日</span>
        <a-date-picker v-model:value="born" picker="month" />
      </a-form-item>
      <a-form-item class="infoItem" name="email">
        <span>邮箱</span>
        <a-input
          v-model:value="formState.email"
          type="text"
          autocomplete="off"
          placeholder="请填写您的邮箱"
        />
      </a-form-item>
      <a-form-item class="buttons" :wrapper-col="{ span: 3, offset: 21 }">
        <a-button style="margin-right: 26px" @click="resetForm">取消</a-button>
        <a-button type="primary" html-type="submit">完成</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import type { Rule } from "ant-design-vue/es/form";
import type { FormInstance } from "ant-design-vue";
interface FormState {
  pass: string;
  checkPass: string;
  age: number | undefined;
}

const formRef = ref<FormInstance>();
const formState = reactive<FormState>({
  name: "",
  gender:"",
  apply_state: "",
  phone: "",
  born: "",
  email: "",
});
let validateName = async (_rule: Rule, value: number) => {
  if (!value) {
    return Promise.reject("请填写您的姓名");
  }
  if (value.length<=2 || value.length>=8) {
    return Promise.reject("长度在2-10之间");
  }  else {
      return Promise.resolve();
  }
};
let validateGender = async (_rule: Rule, value: number) => {
  if (!value) {
    return Promise.reject("请填写您的姓名");
  }
  if (!Number.isInteger(value)) {
    return Promise.reject("Please input digits");
  } else {
    if (value < 18) {
      return Promise.reject("Age must be greater than 18");
    } else {
      return Promise.resolve();
    }
  }
};





const rules: Record<string, Rule[]> = {
  name: [{ required: true, validator: validateName, trigger: "change" }],
  gender: [{required: true, validator: validateGender, trigger: "change" }],
  apply_state: [{ required: true,required: true,validator: checkApply_state, trigger: "change" }],
  phone: [{ required: true,validator: checkPhone, trigger: "change" }],
  born: [{ required: true,validator: checkBorn, trigger: "change" }],
  email: [{required: true, validator: checkEmail, trigger: "change" }],
};
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
};
const handleFinish = (values: FormState) => {
  console.log(values, formState);
};
const handleFinishFailed = (errors) => {
  console.log(errors);
};
const resetForm = () => {
  formRef.value.resetFields();
};
const handleValidate = (...args) => {
  // console.log(args);
};
</script>

<style lang="less" scoped>
.infoBox {
  width: 100%;
  height: 400px;
  padding: 24px 20px;
  box-sizing: border-box;
  background: #f1f1f1;
  .tips {
    font-size: 14px;
    color: #222;
    margin-bottom: 14px;
  }
  .formList {
    widows: 100%;
    height: 240px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .infoItem {
      width: 47%;
      height: 85px;
      display: flex;
      justify-content: center;
      flex-direction: column;
      margin-bottom: 6px;
      ::v-deep(.ant-form-item-control) {
        max-width: 100% !important;
      }
      ::v-deep(.ant-select){
        width: 100% !important;
        .ant-select-selector{
          height: 40px ;
          border-radius: 0 ;
        }
      }
      ::v-deep(.ant-picker){
        width: 100% !important;
        border-radius: 0 ;
        height: 40px ;
      }
      ::v-deep(.ant-radio-group ){
        width: 100% !important;
        display: flex;
        justify-content: space-between;
        .ant-radio-button-wrapper{
          width: 155px;
          text-align: center;
          height: 40px ;
          border-radius: 0 ;
        }
      }
      ::v-deep(.ant-input) {
        width: 100%;
        height: 100%;
        border-radius: 0;
        height: 40px;
        // padding-bottom: 11px;
      }
    }
    .buttons {
      width: 100%;
      ::v-deep(.ant-form-item-control-input-content) {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
