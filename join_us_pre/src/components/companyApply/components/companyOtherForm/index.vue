<template>
  <a-form
    ref="formRef"
    name="custom-validation"
    :model="formState"
    :rules="rules"
    v-bind="layout"
    @finish="handleFinish"
    @validate="handleValidate"
    @finishFailed="handleFinishFailed"
  >
    <a-form-item has-feedback label="经营范围" name="business_scope">
      <a-textarea
        v-model:value.trim="formState.business_scope"
        placeholder="请填写公司经营范围"
        :rows="2"
      />
    </a-form-item>

    <a-form-item has-feedback label="公司简介" name="company_introduction">
      <a-textarea
        v-model:value.trim="formState.company_introduction"
        placeholder="请填写公司简介"
        :rows="2"
      />
    </a-form-item>
    <a-form-item has-feedback label="发展历程" name="development_history">
      <a-textarea
        v-model:value.trim="formState.development_history"
        placeholder="请填写公司发展历程"
        :rows="2"
      />
    </a-form-item>
    <a-form-item has-feedback label="工作时间" name="work_time">
      <a-input
        v-model:value="formState.work_time"
        autocomplete="off"
        placeholder="请填写公司工作时间"
      />
    </a-form-item>
    <a-form-item has-feedback label="工作制度" name="rest">
      <a-select
        v-model:value="formState.rest"
        mode="multiple"
        style="width: 100%"
        :options="[{value:'双休'},{value:'弹性工作'}]"
        placeholder="请选择会填写工作制度"
      ></a-select>
    </a-form-item>
    <a-form-item has-feedback label="公司福利" name="company_welfare">
      <a-select
        v-model:value="formState.company_welfare"
        mode="tags"
        style="width: 100%"
        placeholder="请选择或填写公司福利"
      ></a-select>
    </a-form-item>
    <a-form-item has-feedback label="人才发展" name="development">
      <a-select
        v-model:value="formState.development"
        mode="tags"
        style="width: 100%"
        placeholder="请选择或填写人才发展"
      ></a-select>
    </a-form-item>
   

    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button style="margin-right: 10px;" type="primary" @click="backPre">上一步</a-button>
      <a-button type="primary" html-type="submit">提交</a-button>
      <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import type { Rule } from "ant-design-vue/es/form";
import type { ShowSearchType } from "ant-design-vue/es/cascader";
import type { FormInstance } from "ant-design-vue";
import { emitter } from "@/utils/emitter";
const props = defineProps<{ getData2: any ,backStep:any}>();
const formRef = ref<FormInstance>();
interface FormState {
  business_scope: string;
  company_introduction: string;
  work_time: string;
  company_welfare:any[];
  development: any[];
  development_history: string;
  rest: any[];
}
const formState = reactive<FormState>({
  business_scope: "", //经营范围
  company_introduction: "", //公司介绍
  work_time: "", //工作时间
  company_welfare: [], //公司福利tag
  development: [], //人才发展tag
  development_history: "", //发展历程
  rest: [], //	双休、弹性工作
});
//返回上一步
const backPre = ()=>{
  props.backStep()
}


const handleFinish = async (values: FormState) => {
  let rest = ''
  if(formState.rest.length){
    formState.rest.length==1?rest = formState.rest[0]:rest=formState.rest[0]+'、'+formState.rest[1]
  }else{
    rest=''
  }
  const params = {
    ...values,
    rest,
    development:JSON.stringify(formState.development),
    company_welfare:JSON.stringify(formState.company_welfare),
  };
  await formRef.value?.validateFields();
  props.getData2(params);
};
const handleFinishFailed = (errors: any) => {
  // console.log(errors);
};
const resetForm = () => {
  formRef.value?.resetFields();
};
const handleValidate = (...args: any) => {
  // console.log(args);
};

let checkBusiness_scope = async (_rule: Rule, value: any) => {
  if (!value) {
    return Promise.reject("请填写经营范围");
  }
  if (value.length < 2 || value.length > 300) {
    return Promise.reject("经营范围只能为2-300的字符");
  } else {
    return Promise.resolve();
  }
};
let checkCompany_introduction = async (_rule: Rule, value: any) => {
  if (!value) {
    return Promise.reject("请填写公司介绍");
  }
  if (value.length < 2 || value.length > 300) {
    return Promise.reject("公司介绍只能为2-300的字符");
  } else {
    return Promise.resolve();
  }
};
let checkWork_time = async (_rule: Rule, value: any) => {
  if (!value) {
    return Promise.reject("请填写工作时间");
  }
  if (value.length < 2 || value.length > 60) {
    return Promise.reject("工作时间只能为2-60的字符");
  } else {
    return Promise.resolve();
  }
};
let checkDevelopment_history = async (_rule: Rule, value: any) => {
  if (!value) {
    return Promise.reject("请填写公司发展历程");
  }
  if (value.length < 2 || value.length > 300) {
    return Promise.reject("公司发展历程只能为2-300的字符");
  } else {
    return Promise.resolve();
  }
};
let checkCompany_welfare = async (_rule: Rule, value: any) => {
  if (!value.length) {
    return Promise.reject("请填写公司福利");
  }
  if (value.length > 12) {
    return Promise.reject("公司福利标签不能超过12个");
  } else {
    return Promise.resolve();
  }
};
let checkDevelopment = async (_rule: Rule, value: any) => {
  if (!value.length) {
    return Promise.reject("请填写人才发展标签");
  }
  if (value.length > 12) {
    return Promise.reject("公人才发展标签不能超过12个");
  } else {
    return Promise.resolve();
  }
};
let checkRest = async (_rule: Rule, value: any) => {
  if (!value.length) {
    return Promise.reject("请选择工作制度");
  }
   else {
    return Promise.resolve();
  }
};

const rules: Record<string, Rule[]> = {
  business_scope: [
    { required: true, validator: checkBusiness_scope, trigger: "change" },
  ],
  company_introduction: [
    { required: true, validator: checkCompany_introduction, trigger: "change" },
  ],
  work_time: [
    { required: true, validator: checkWork_time, trigger: "change" },
  ],
  company_welfare: [
    { required: true, validator: checkCompany_welfare, trigger: "change" },
  ],
  development: [
    { required: true, validator: checkDevelopment, trigger: "change" },
  ],
  development_history: [
    { required: true, validator: checkDevelopment_history, trigger: "change" },
  ],
  rest: [
    { required: true, validator: checkRest, trigger: "change" },
  ],
};
const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 17 },
};
</script>

<style lang="less" scoped>
.ant-form {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-top: 50px;
  margin-left: 20px;

  ::v-deep(.ant-form-item) {
    width: 460px !important;
    padding-bottom: 10px;
    &:last-child {
      text-align: right;
      position: relative;
      right: -60px;
    }
    .ant-input {
      width: 100%;
    }
  }
}
.ant-input {
  border-radius: 0 !important;
}
</style>
