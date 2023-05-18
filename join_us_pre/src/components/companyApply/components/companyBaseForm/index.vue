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
    <a-form-item has-feedback label="公司名称" name="company_name">
      <a-input
        v-model:value="formState.company_name"
        autocomplete="off"
        placeholder="请填写公司名称"
      />
    </a-form-item>

    <a-form-item has-feedback label="所属行业" name="industry">
      <a-select
        allowClear
        showSearch
        :showArrow="false"
        ref="select"
        v-model:value="formState.industry"
        placeholder="请填写所属行业"
      >
        <a-select-option
          v-for="(item, index) in industryData"
          :key="index"
          :value="item.industry_name"
          >{{ item.industry_name }}</a-select-option
        >
      </a-select>
    </a-form-item>

    <a-form-item has-feedback label="法定代表" name="legal_representative">
      <a-input
        v-model:value="formState.legal_representative"
        autocomplete="off"
        placeholder="请填写法定代表人"
      />
    </a-form-item>

    <a-form-item has-feedback label="公司规模" name="people_num">
      <a-select
        allowClear
        showSearch
        :showArrow="false"
        ref="select"
        v-model:value="formState.people_num"
        placeholder="请选择公司规模"
      >
        <a-select-option
          v-for="(item, index) in people_numList"
          :key="index"
          :value="item.name"
          >{{ item.name }}</a-select-option
        >
      </a-select>
    </a-form-item>

    <a-form-item has-feedback label="注册资本" name="capital">
      <a-input
        v-model:value="formState.capital"
        autocomplete="off"
        placeholder="请填写公司注册资本"
      />
    </a-form-item>

    <a-form-item has-feedback label="融资情况" name="financing">
      <a-select
        ref="select"
        allowClear
        showSearch
        :showArrow="false"
        v-model:value="formState.financing"
        placeholder="请选择公司融资情况"
      >
        <a-select-option
          v-for="(item, index) in financingList"
          :key="index"
          :value="item.name"
          >{{ item.name }}</a-select-option
        >
      </a-select>
    </a-form-item>

    <a-form-item has-feedback label="所在城市" name="reg_city">
      <a-cascader
          placeholder="请选择公司所在城市"
          v-model:value="formState.reg_city"
          expand-trigger="hover"
          :autocomplete="false"
          :show-search="{ filter }"
          :field-names="{
            label: 'name',
            value: 'name',
            children: 'subLevelModelList',
          }"
          :options="allCityList"
        />
    </a-form-item>

    <a-form-item has-feedback label="成立时间" name="create_time">
      <a-date-picker
        format="YYYY-MM"
        value-format="YYYY-MM"
        placeholder="请选择公司成立时间"
        style="width: 100%"
        v-model:value="formState.create_time"
        picker="month"
        allowClear
        autocomplete="off"
      />
    </a-form-item>

    <a-form-item has-feedback label="详细地址" name="detail_position">
      <a-input
        v-model:value="formState.detail_position"
        autocomplete="off"
        placeholder="请填写公司详细地址"
      />
    </a-form-item>

    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary"  style="margin-right: 10px;" @click="backPre">上一步</a-button>
      <a-button type="primary" html-type="submit">下一步</a-button>
      <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import type { Rule } from "ant-design-vue/es/form";
import type { ShowSearchType } from "ant-design-vue/es/cascader";
import type { FormInstance } from "ant-design-vue";
import { useGetConditionData } from "@/store/condition";
import { useIndustryStore } from "@/store/industry";
import { IIndustryData } from "@/types/industry";
import { useCity } from "@/store/city";
const { industryList } = useIndustryStore();
const { conditionData } = useGetConditionData();
const { allCityList } = useCity();
const industryData = ref<IIndustryData[]>(industryList);
const props = defineProps<{getData:any,backStep:any}>()
//删除数组中为不限的一项
type TConditionData = {
  code: number;
  name: string;
};

//返回上一步
const backPre = ()=>{
  props.backStep()
}
const dealWithData = (data: TConditionData[]) => {
  return data.filter((item) => item.name !== "不限");
};
const people_numList = dealWithData(conditionData[4] as TConditionData[]);
const financingList = dealWithData(conditionData[5] as TConditionData[]);
const formRef = ref<FormInstance>();
interface FormState {
  company_name: string;
  industry: string | undefined;
  legal_representative: string; //法定代表人
  people_num: string | undefined;
  financing: string | undefined;
  create_time: string;
  reg_city: any[];
  detail_position: string;
  capital: string; //注册资本
}
const formState = reactive<FormState>({
  company_name: "",
  industry: undefined,
  people_num: undefined,
  financing: undefined,
  legal_representative: "",
  create_time: "",
  reg_city: [], //region
  detail_position: "",
  capital: "",
});

const filter: ShowSearchType["filter"] = (inputValue, path) => {
  return path.some((option) => option.name.indexOf(inputValue) > -1);
};
const handleFinish = async(values: FormState) => {
  const params = {
    ...values,
    reg_city:formState.reg_city[1],
    region:formState.reg_city[2],
  } 
  await formRef.value?.validateFields()
  props.getData(params)
  
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


let checkCompany_name = async (_rule: Rule, value: any) => {
  if (!value) {
    return Promise.reject("请填写公司名称");
  }
  if (value.length<2 || value.length>25) {
    return Promise.reject("公司名称只能为2-25的字符");
  }  else {
      return Promise.resolve();
    }
};
let checkIndustry = async (_rule: Rule, value: any) => {
  if (!value) {
    return Promise.reject("请填写公司索虎行业");
  }  else{
    return Promise.resolve();
  }
};
let checkLegal_representative = async (_rule: Rule, value: any) => {
  if (!value) {
    return Promise.reject("请填写公司法定代表人");
  } else if(value.length<2 || value.length>25){
    return Promise.reject("法定代表人只能为2-25的字符");
  } else{
    return Promise.resolve();
  }
};
let checkPeople_num = async (_rule: Rule, value: any) => {
  if (!value) {
    return Promise.reject("请选择公司规模");
  }else{
    return Promise.resolve();
  }
};
let checkFinancing = async (_rule: Rule, value: any) => {
  if (!value) {
    return Promise.reject("请选择公司融资情况");
  }else{
    return Promise.resolve();
  }
};
let checkCreate_time = async (_rule: Rule, value: any) => {
  if (!value) {
    return Promise.reject("请选择公司创建时间");
  }else{
    return Promise.resolve();
  }
};
let checkReg_city = async (_rule: Rule, value: any) => {
  if (!value.length) {
    return Promise.reject("请选择公司所在城市");
  }else{
    return Promise.resolve();
  }
};

let checkDetail_position = async (_rule: Rule, value: any) => {
  if (!value.length) {
    return Promise.reject("请填写公司的详细地址");
  }else if(value.length<2 || value.length>100){
    return Promise.reject("详细地址只能为2-100的字符");
  } else{
    return Promise.resolve();
  }
};
let checkCapital = async (_rule: Rule, value: any) => {
  if (!value.length) {
    return Promise.reject("请填写公司的注册资本");
  }else if(value.length<2 || value.length>30){
    return Promise.reject("注册资本只能为2-30的字符");
  } else{
    return Promise.resolve();
  }
};


const rules: Record<string, Rule[]> = {
  company_name: [{ required: true, validator: checkCompany_name, trigger: "change" }],
  industry: [{ required: true, validator: checkIndustry, trigger: "change" }],
  legal_representative: [{ required: true, validator: checkLegal_representative, trigger: "change" }],
  people_num: [{ required: true, validator: checkPeople_num, trigger: "change" }],
  financing: [{ required: true, validator: checkFinancing, trigger: "change" }],
  create_time: [{ required: true, validator: checkCreate_time, trigger: "change" }],
  reg_city: [{ required: true, validator: checkReg_city, trigger: "change" }],
  detail_position: [{ required: true, validator: checkDetail_position, trigger: "change" }],
  capital: [{ required: true, validator: checkCapital, trigger: "change" }],
};
const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};

</script>

<style lang="less" scoped>
.ant-form{
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-top: 50px;
  margin-left: 20px;

  ::v-deep(.ant-form-item){
    width: 460px !important;
    padding-bottom: 10px;
    &:last-child{
      text-align: right;
      position: relative;
      right: -60px;
    }
    .ant-input{
      width: 100%;
    }
  }

}
.ant-input {
  border-radius: 0 !important;
}
</style>
