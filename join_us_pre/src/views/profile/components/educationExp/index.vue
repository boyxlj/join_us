<template>
  <div class="hoveList infoBox">
    <div class="tips">编辑教育经历</div>
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
      <a-form-item class="infoItem projectName" name="school">
        <span>学校名称</span>
        <a-input
          v-model:value.trim="formState.school"
          type="text"
          autocomplete="off"
          placeholder="请填写学校名称"
        />
      </a-form-item>
      <a-form-item class="infoItem projectRole" name="school_type">
        <span>学制类型</span>
        <a-select
          placeholder="请选择您的学制类型"
          v-model:value="formState.school_type"
          style="width: 120px"
        >
          <a-select-option value="全日制">全日制</a-select-option>
          <a-select-option value="非全日制">非全日制</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item class="infoItem projectRole" name="degree">
        <span>学历</span>
        <a-select
          placeholder="请选择您的学历"
          v-model:value="formState.degree"
          style="width: 120px"
        >
          <a-select-option value="初中及以下">初中及以下</a-select-option>
          <a-select-option value="中专/中技">中专/中技</a-select-option>
          <a-select-option value="高中">高中</a-select-option>
          <a-select-option value="大专">大专</a-select-option>
          <a-select-option value="本科">本科</a-select-option>
          <a-select-option value="硕士">硕士</a-select-option>
          <a-select-option value="博士">博士</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item class="infoItem projectRole" name="major">
        <span>专业</span>
        <a-input
          v-model:value.trim="formState.major"
          type="text"
          autocomplete="off"
          placeholder="请填写您的专业"
        />
      </a-form-item>

      <a-form-item class="infoItem" name="enter_schoolTime">
        <span>在职时间</span>
        <a-range-picker
          v-model:value="formState['enter_schoolTime']"
          value-format="YYYY-MM"
          format="YYYY-MM"
          :placeholder="['入校时间', '毕业时间']"
        />
      </a-form-item>
      <a-form-item class="infoItem workContent" name="school_exp">
        <span>在校经历(选填)</span>
        <a-textarea
          v-model:value="formState.school_exp"
          autocomplete="off"
          placeholder="请填写您的在校经历"
          type="text"
          :rows="6"
          showCount
          :maxlength="200"
        />
      </a-form-item>

      <a-form-item class="buttons" :wrapper-col="{ span: 3, offset: 21 }">
        <a-button style="margin-right: 15px" @click="resetForm">取消</a-button>
        <a-button type="primary" html-type="submit">完成</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import type { Rule } from "ant-design-vue/es/form";
import dayjs, { Dayjs } from "dayjs";
import type { FormInstance } from "ant-design-vue";
import {useUserInfo} from "@/store/user"
const userStore = useUserInfo()

const props = withDefaults(defineProps<{ changeEducationExpForm: any,userInfo:any }>(), {});
const mode2 = ref<any>(["month", "month"]);
interface FormState {
  enter_schoolTime: any[];
  school: string;
  degree: string | undefined;
  school_type: string |undefined;
  major: string;
  school_exp: string;
  leave_schoolTime: string;
}

onMounted(()=>{
  formState.school=props.userInfo.school;
  formState.degree=props.userInfo.degree?props.userInfo.degree: undefined;
  formState.school_type=props.userInfo.school_type ?props.userInfo.school_type:undefined;
  formState.school_exp=props.userInfo.school_exp;
  formState.major=props.userInfo.major;
  formState.enter_schoolTime=[props.userInfo.enter_schoolTime,props.userInfo.enter_schoolTime]
  formState.leave_schoolTime=props.userInfo.leave_schoolTime
})


const monthFormat = "YYYY/MM";
const formRef = ref<FormInstance>();
const formState = reactive<FormState>({
  school: '',
  degree:undefined,
  school_type:undefined,
  school_exp: "",
  major: "",
  enter_schoolTime: [],
  leave_schoolTime: "",
});


let validateSchool_exp = async (_rule: Rule, value: string) => {
  if (value.length>200) {
    return Promise.reject("在校经历字数不能超度200");
  }
  else {
    return Promise.resolve();
  }
};
let validateSchool_type = async (_rule: Rule, value: string) => {
  if (!value) {
    return Promise.reject("请选择您的学制类型");
  }
  else {
    return Promise.resolve();
  }
};
let validateDegree = async (_rule: Rule, value: string) => {
  if (!value) {
    return Promise.reject("请选择您的学历");
  }
  else {
    return Promise.resolve();
  }
};
let validateMajor = async (_rule: Rule, value: string) => {
  if (!value) {
    return Promise.reject("请填写您的专业名称");
  }else if(value.length>=16){
    return Promise.reject("专业名称不能超过16");
  }
  else {
    return Promise.resolve();
  }
};
let validateSchool = async (_rule: Rule, value: string) => {
  if (!value) {
    return Promise.reject("请填写所在学校名称");
  }else if(value.length>=16){
    return Promise.reject("学校名称长度不能超过16");
  }
  else {
    return Promise.resolve();
  }
};
let validateEnter_schoolTime = async (_rule: Rule, value: string) => {
  if (value.length<2) {
    return Promise.reject("请选择您的在校时间");
  }
  else {
    return Promise.resolve();
  }
};




const rules: Record<string, Rule[]> = {
  school: [{ required: true, validator: validateSchool, trigger: "change" }],
  school_type: [{ required: true, validator: validateSchool_type, trigger: "change" }],
  degree: [{ required: true, validator: validateDegree, trigger: "change" }],
  major: [{  required: true, validator: validateMajor, trigger: "change" }],
  enter_schoolTime: [{ required: true, validator: validateEnter_schoolTime, trigger: "change" }],
  school_exp: [{  validator: validateSchool_exp, trigger: "change" }],
};
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
};
const handleFinish = async(values: FormState) => {
  const obj = {...values,enter_schoolTime:formState.enter_schoolTime[0],leave_schoolTime:formState.enter_schoolTime[1]}
  const res =await userStore.updateUseInfo(obj)
  if(res===200){
     props.changeEducationExpForm();
  }
};
const handleFinishFailed = (errors: any) => {
  // console.log('@@',errors.values.born);
};
const resetForm = () => {
  formRef.value?.resetFields();
  props.changeEducationExpForm();
};
const handleValidate = (...args: any) => {
  // console.log(args);
};
</script>

<style lang="less" scoped>
.infoBox {
  width: 100%;
  min-height: 600px;
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
    min-height: 240px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .infoItem {
      width: 47%;
      min-height: 85px;
      display: flex;
      justify-content: center;
      flex-direction: column;
      margin-bottom: 6px;
      ::v-deep(.ant-form-item-control) {
        max-width: 100% !important;
      }
      ::v-deep(.ant-select) {
        width: 100% !important;
        .ant-select-selector {
          height: 40px;
          border-radius: 0;
        }
      }
      ::v-deep(.ant-picker) {
        width: 100% !important;
        border-radius: 0;
        height: 40px;
      }
      ::v-deep(.ant-radio-group) {
        width: 100% !important;
        display: flex;
        justify-content: space-between;
        .ant-radio-button-wrapper {
          width: 155px;
          text-align: center;
          height: 40px;
          border-radius: 0;
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
    .workContent {
      width: 100%;
      min-height: 190px;
      ::v-deep(.ant-input) {
        height: auto !important;
      }
    }
    .skillContent {
      width: 100%;
    }
    .buttons {
      width: 100%;
      ::v-deep(.ant-form-item-control-input-content) {
        display: flex;
        justify-content: flex-end;
      }
      ::v-deep(.ant-btn) {
        border-radius: 0;
      }
    }
  }
}

.allHopeJob {
  height: 70vh;
  width: 100%;
  overflow-y: auto;
  position: relative;
  top: -16px;
  left: 14px;
  user-select: none;
  div {
    margin-bottom: 20px;
    .title {
      display: block;
      margin-bottom: 10px;
      font-size: 18px;
      font-weight: bold;
    }
    .boxs {
      .item {
        transition: all 0.2s linear;
        cursor: pointer;
        display: inline-block;
        margin-right: 26px;
        margin-bottom: 13px;
        &:hover {
          color: var(--themeColor);
        }
      }
    }
  }
}
.searchSelect {
  position: absolute;
  width: 300px;
  height: 38px;
  top: 15px;
  right: 100px;
}
</style>
