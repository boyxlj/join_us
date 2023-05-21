<template>
  <div class="editorCompanyInfo">
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
    <a-form-item has-feedback label="公司Logo" name="">
      <a-upload
        v-model:file-list="fileList"
        name="avatar"
        list-type="picture-card"
        class="avatar-uploader"
        :show-upload-list="false"
        :action="uploadUserAvatarUrl"
        :before-upload="beforeUpload"
        @change="handleChange"
      >
        <img style="width: 100%" v-if="imageUrl" :src="imageUrl" alt="avatar" />
        <div v-else>
          <loading-outlined v-if="loading"></loading-outlined>
          <plus-outlined v-else></plus-outlined>
          <div class="ant-upload-text">公司Logo</div>
        </div>
      </a-upload>
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" html-type="submit">提交</a-button>
      <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
    </a-form-item>
  </a-form>
  </div>
</template>

<script setup lang="ts">
import type { UploadChangeParam } from "ant-design-vue";
import type { Rule } from "ant-design-vue/es/form";
import {message} from "ant-design-vue"
import { LoadingOutlined,PlusOutlined} from "@ant-design/icons-vue";
import type { ShowSearchType } from "ant-design-vue/es/cascader";
import type { FormInstance } from "ant-design-vue";
import { uploadUserAvatarUrl } from "@/api/upload";
import { useGetConditionData } from "@/store/condition";
import { useIndustryStore } from "@/store/industry";
import { IIndustryData } from "@/types/industry";
import { useCity } from "@/store/city";
import {useCompanyInfo} from "@/store/company_hr"
import {ICompanyInfo} from "@/types/company"
import {updateCompanyInfo} from "@/api"
import {useCompanyState} from "@/hooks/useCompanyState"
import {useHrState} from "@/hooks/useHrState"
const { industryList } = useIndustryStore();
const { conditionData } = useGetConditionData();
const { allCityList } = useCity();
const industryData = ref<IIndustryData[]>(industryList);
const companyInfoList =  useCompanyInfo().companyInfoList as ICompanyInfo[]
const emit = defineEmits(['closeModel'])

//删除数组中为不限的一项
type TConditionData = {
  code: number;
  name: string;
};

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

  business_scope: string;
  company_introduction: string;
  work_time: string;
  company_welfare:any[];
  development: any[];
  development_history: string;
  rest: any[];
}
//点击用户头像
const fileList = ref([]);
const loading = ref<boolean>(false);
const imageUrl = ref<string>("");

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
  business_scope: "", //经营范围
  company_introduction: "", //公司介绍
  work_time: "", //工作时间
  company_welfare: [], //公司福利tag
  development: [], //人才发展tag
  development_history: "", //发展历程
  rest: [], //	双休、弹性工作
  
});
onMounted(()=>{
  let reg_city:any[] = [companyInfoList[0]?.reg_city,companyInfoList[0]?.region]
  let company_welfare:any[] =companyInfoList[0]?.company_welfare?JSON.parse(companyInfoList[0]?.company_welfare):[]
  let development:any[] = companyInfoList[0]?.development?JSON.parse(companyInfoList[0]?.development):[]
  let rest:any[] = []
  if(companyInfoList[0]?.rest.includes('、')){
    rest= [companyInfoList[0]?.rest.split('、')[0],companyInfoList[0]?.rest.split('、')[1]]
  }else{
    rest= [companyInfoList[0]?.rest]
  }
  formState.company_name= companyInfoList[0]?.company_name,
  formState.industry= companyInfoList[0]?.industry,
  formState.people_num= companyInfoList[0]?.people_num,
  formState.financing= companyInfoList[0]?.financing,
  formState.legal_representative= companyInfoList[0]?.legal_representative,
  formState.create_time= companyInfoList[0]?.create_time,
  formState.reg_city= reg_city, //region []
  formState.detail_position= companyInfoList[0]?.detail_position,
  formState.capital= companyInfoList[0]?.capital,
  formState.business_scope= companyInfoList[0]?.business_scope, //经营范围
  formState.company_introduction= companyInfoList[0]?.company_introduction, //公司介绍
  formState.work_time= companyInfoList[0]?.work_time, //工作时间
  formState.company_welfare= company_welfare, //公司福利tag[]
  formState.development= development, //人才发展tag[]
  formState.development_history= companyInfoList[0]?.development_history, //发展历程
  formState.rest= rest //	双休、弹性工作[]
  imageUrl.value= companyInfoList[0]?.logo //	双休、弹性工作[]
})

const handleChange = (info: UploadChangeParam) => {
  if (info.file.status === "uploading") {
    loading.value = true;
    return;
  }

  if (info.file.status === "error") {
    loading.value = false;
    message.error("图片上传失败");
  }
  if (info.file.status === "done") {
    loading.value = false;
    if (info.file.response.code !== 200) return message.error("图片上传失败");
    imageUrl.value = info.file.response.url;
  }
};
const beforeUpload = (file: any) => {
  const allowImgType = ["jpeg", "png", "jpg"];
  if (!allowImgType.includes(file.type?.split("/")[1])) {
    message.error(`图片只能上传以下类型：${allowImgType.join("、")}`);
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("图片的大小不能超过 2MB!");
  }
  return allowImgType.includes(file.type?.split("/")[1]) && isLt2M;
};
const filter: ShowSearchType["filter"] = (inputValue, path) => {
  return path.some((option) => option.name.indexOf(inputValue) > -1);
};
const handleFinish = async(values: FormState) => {
  let rest = ''
  if(formState.rest.length){
    formState.rest.length==1?rest = formState.rest[0]:rest=formState.rest[0]+'、'+formState.rest[1]
  }else{
    rest=''
  }
  let reg_city = ''
  let region = ''
  if(formState.reg_city.length==2){
    reg_city = formState.reg_city[0]
    region = formState.reg_city[1]
  }else{
    reg_city = formState.reg_city[1]
    region = formState.reg_city[2]
  }
  const params = {
    ...values,
    rest,
    development:JSON.stringify(formState.development),
    company_welfare:JSON.stringify(formState.company_welfare),
    reg_city,
    region,
    logo:imageUrl.value,
    company_id:companyInfoList[0].company_id
  } 
  if(!(await useCompanyState()).state) return 
  if(!(await useHrState()).state) return 
  await formRef.value?.validateFields()
  const res:any = await updateCompanyInfo(params)
  if(res.code!==200) return message.error("修改失败")
  emit('closeModel')
  useCompanyInfo().getCompanyInfo(companyInfoList[0].company_id)
  message.success("修改提交成功")
  
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
  company_name: [{ required: true, validator: checkCompany_name, trigger: "change" }],
  industry: [{ required: true, validator: checkIndustry, trigger: "change" }],
  legal_representative: [{ required: true, validator: checkLegal_representative, trigger: "change" }],
  people_num: [{ required: true, validator: checkPeople_num, trigger: "change" }],
  financing: [{ required: true, validator: checkFinancing, trigger: "change" }],
  create_time: [{ required: true, validator: checkCreate_time, trigger: "change" }],
  reg_city: [{ required: true, validator: checkReg_city, trigger: "change" }],
  detail_position: [{ required: true, validator: checkDetail_position, trigger: "change" }],
  capital: [{ required: true, validator: checkCapital, trigger: "change" }],
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
  wrapperCol: { span: 16 },
};

</script>

<style lang='less' scoped> 
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