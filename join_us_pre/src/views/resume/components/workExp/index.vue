<template>
  <div class="hoveList infoBox">
    <div class="tips">编辑工作经历</div>
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
      <a-form-item class="infoItem projectName" name="company">
        <span>公司名称</span>
        <a-input
          v-model:value.trim="formState.company"
          type="text"
          autocomplete="off"
          placeholder="请填写公司名称"
        />
      </a-form-item>
      <a-form-item class="infoItem projectRole" name="industry">
        <span>所属行业</span>
        <a-input
          v-model:value.trim="formState.industry"
          type="text"
          autocomplete="off"
          @click="openIndustryModel"
          placeholder="请填写所属行业"
        />
      </a-form-item>
      <a-form-item class="infoItem projectRole" name="department">
        <span>所属部门（选填）</span>
        <a-input
          v-model:value.trim="formState.department"
          type="text"
          autocomplete="off"
          placeholder="请填写您的所属部门"
        />
      </a-form-item>
      <a-form-item class="infoItem projectRole" name="post">
        <span>职位名称</span>
        <a-input
          v-model:value.trim="formState.post"
          type="text"
          autocomplete="off"
          @click="openHopeJobModel"
          placeholder="请填写您的职位名称"
        />
      </a-form-item>

      <a-form-item class="infoItem" name="enter_time">
        <span>在职时间</span>
        <a-range-picker
          v-model:value="formState['enter_time']"
          value-format="YYYY-MM"
          format="YYYY-MM"
          :placeholder="['入职时间', '离职时间']"
        />
      </a-form-item>
      <a-form-item class="infoItem workContent" name="content">
        <span>工作内容</span>
        <a-textarea
          v-model:value.trim="formState.content"
          autocomplete="off"
          placeholder="请填写您的工作内容"
          type="text"
          :rows="6"
          showCount
          :maxlength="200"
          
        />
      </a-form-item>
      <a-form-item class="infoItem workContent" name="performance">
        <span>工作业绩（选填）</span>
        <a-textarea
          v-model:value.trim="formState.performance"
          autocomplete="off"
          placeholder="请填写您的工作业绩"
          type="text"
          :rows="6"
          showCount
          :maxlength="200"
        />
      </a-form-item>
      <a-form-item class="infoItem skillContent" name="skill">
        <span>拥有技能（选填）</span>
        <div class="skillBox">
          <a-select
          v-model:value="formState.skill"
          mode="tags"
          placeholder="请选择您具备的技能"
          style="width: 200px"
        >
        <option  :value="item" v-for="(item,index) in skillTag" :key="index">{{ item }}</option>
        </a-select>
        </div>
      </a-form-item>

      <a-form-item class="buttons" :wrapper-col="{ span: 3, offset: 21 }">
        <a-button style="margin-right: 15px" @click="resetForm">取消</a-button>
        <a-button type="primary" html-type="submit">完成</a-button>
      </a-form-item>
    </a-form>
 
        <!-- 期望职位对话框 -->
        <a-modal
      centered
      :width="1000"
      :maskClosable="false"
      :footer="null"
      v-model:visible="showHopeJobModel"
      title="所有职位"
      @ok="handleOkByHopeJob"
      style="position: relative"
    >
      <div class="searchSelect">
        <a-input-search
          v-model:value.trim="hopeJobValue"
          placeholder="请输入您想要查询的职位"
          enter-button
          @search="onSearchHopeJob"
        />
      </div>
      <div class="allHopeJob">
        <template v-if="positionTypeData.length">
          <div v-for="item in positionTypeData" :key="item.position_type_id">
            <span class="title">{{ item.position_type_name }}</span>
            <li class="boxs">
              <span
              @click="selectHopeJob(child.type_name)"
                class="item"
                v-for="child in item.children"
                :key="child.position_type_id"
                >{{ child.type_name }}</span
              >
            </li>
          </div>
        </template>
        <Empty :height="500" v-else />
      </div>
      
    </a-modal>
<!-- 期望职行业对话框 -->
    <a-modal
      centered
      :width="1000"
      :maskClosable="false"
      :footer="null"
      v-model:visible="showIndustryModel"
      title="请选择您所需的行业"
      @ok="handleOkIndustry"
      style="position: relative"
    >
      <div class="searchSelect">
        <a-input-search
          v-model:value.trim="industryValue"
          placeholder="请输入您想要查询的行业"
          enter-button
          @search="onSearchIndustry"
        />
      </div>
      <div class="allHopeJob">
        <template v-if="industryData.length">
          <div>
            <li class="boxs">
              <span
              @click="selectIndustry(item.industry_name)"
                class="item"
                v-for="item in industryData"
                :key="item.industry_id"
                >{{ item.industry_name}}</span
              >
            </li>
          </div>
        </template>
        <Empty msg="没有找到您所需的行业" :height="500" v-else />
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import type { Rule } from "ant-design-vue/es/form";
import { FormInstance, message } from "ant-design-vue";
import { useCity } from "@/store/city";
import { useJobTypeStore } from "@/store/positionType";
import { IPositionType1 } from "@/types/jobType";
import Empty from "@/components/common/empty/index.vue";
import type { ShowSearchType } from "ant-design-vue/es/cascader";
import {addUserResume,updateUserResume} from "@/api"
import {useIndustryStore} from "@/store/industry"
import {IIndustryData} from "@/types/industry"
import {IUserInfo} from "@/types/userInfo"
import {useUserInfo} from "@/store/user"
const userStore = useUserInfo()
const userInfo = computed(()=>userStore.userInfoList[0] as IUserInfo)
const resumeList = computed(()=>userStore.resumeList as IResumeData[])
const {industryList} =  useIndustryStore()
const { provinceAndCityList } = useCity();

const skillTag = ref(['Html','Css','Javascript','Typescript','Vue','React','Express','NodeJs',
'spring','springCloud','Python','Java'])

interface IResumeData {
  id: number;
  resume_id: string;
  userId: string;
  company: string;
  industry: string;
  post: string;
  department: string;
  enter_time: string;
  leave_time: string;
  content: string;
  performance: string;
  skill: string;
  addTime?: any;
  update_time?: any;
}
const filter: ShowSearchType["filter"] = (inputValue, path) => {
  return path.some((option) => option.name.indexOf(inputValue) > -1);
};

onMounted(()=>{
  if(props.resumeId){
    const data = resumeList.value?.filter(item=>item.resume_id==props.resumeId)[0]
    formState.enter_time =  [data.enter_time,data.leave_time]
    formState.department = data.department
    formState.post =   data.post
    formState.content =   data.content
    formState.industry =   data.industry
    formState.skill =   data.skill?.length>2? JSON.parse(data.skill):[]
    formState.company =   data.company
    formState.performance =   data.performance
  }
})

const props = withDefaults(defineProps<{ changeWorkExpForm: any,resumeId:string|'' }>(), {});
const mode2 = ref<any>(["month", "month"]);

//---------期望职位
const { positionTypeList } = useJobTypeStore();
const positionTypeData = ref<IPositionType1[] | any[]>(positionTypeList);
//期望职位搜索框
const hopeJobValue = ref("");
const onSearchHopeJob = (val: string) => {
  if (!val) {
    positionTypeData.value = positionTypeList;
    return;
  }
  positionTypeData.value = positionTypeList;
  const res = (positionTypeData.value as IPositionType1[])
    ?.map((item) => {
      const arr = item.children?.map((items) => {
        if (items.type_name.includes(val.toLocaleLowerCase())) {
          return items;
        }
        return [];
      });
      return {
        ...item,
        children: arr?.filter((item1: any) => item1.type_name),
      };
    })
    ?.filter((item) => item.children.length);
  positionTypeData.value = res;
};

//期望职位对话框
const showHopeJobModel = ref(false);
const handleOkByHopeJob = () => {
  showHopeJobModel.value = false;
};

//打开期望职位对话框
const openHopeJobModel = ()=>{
  showHopeJobModel.value = true;
  hopeJobValue.value = ''
  positionTypeData.value = positionTypeList;
}

//点击选中期望职位
const selectHopeJob = (hopeJob:string)=>{
  showHopeJobModel.value = false;
  formState.post = hopeJob
}

//-----------期望行业
const industryData = ref<IIndustryData[]>(industryList)
//期望行业搜索框
const industryValue = ref("");
const onSearchIndustry= (val: string) => {
  if (!val) {
    industryData.value = industryList;
    return;
  }
  industryData.value = industryList;
  const res = industryData.value?.filter(item=>item.industry_name.includes(val))
  industryData.value = res;
};
//期望行业对话框
const showIndustryModel = ref(false);
const handleOkIndustry = () => {
  showHopeJobModel.value = false;
};

//打开期望行业对话框
const openIndustryModel = ()=>{
  showIndustryModel.value = true;
  industryValue.value = ''
  industryData.value = industryList;
}

//点击选中期望行业
const selectIndustry= (industry:string)=>{
  showIndustryModel.value = false;
  formState.industry = industry
}

interface FormState {
  enter_time: any[];
  department: string;  //部门
  company: string;
  post: string;    //职务
  industry: string;  
  content: string;
  performance: string;   //业绩
  skill: string | undefined; 
}
const formRef = ref<FormInstance>();
const formState = reactive<FormState>({
  enter_time: [],
  department: "",
  post: "",
  content: "",
  industry: "",
  skill: undefined ,
  company: "",
  performance: "",
});


let checkPerformance = async (_rule: Rule, value: string) => {
  if (value) {
    // return Promise.reject("请填写您的工作业绩");
  }
  else {
    return Promise.resolve();
  }
};
let checkSkill = async (_rule: Rule, value: string) => {
  if (value?.length&&value?.length>=8) {
    return Promise.reject("技能标签不能超过8个");
  }
  else {
    return Promise.resolve();
  }
};
let checkContent = async (_rule: Rule, value: string) => {
  if (!value) {
    return Promise.reject("请填写您的工作内容");
  }else if(value.length>200){
    return Promise.reject("工作内容在200字以内");
  }
  else {
    return Promise.resolve();
  }
};
let validateIndustry = async (_rule: Rule, value: string) => {
  if (!value) {
    return Promise.reject("请填写所属行业");
  }
  else {
    return Promise.resolve();
  }
};
let validatePost = async (_rule: Rule, value: string) => {
  if (!value) {
    return Promise.reject("请填写您的职务");
  }
  else {
    return Promise.resolve();
  }
};
let validateCompany = async (_rule: Rule, value: string) => {
  if (!value) {
    return Promise.reject("请填写公司名称");
  }
  else {
    return Promise.resolve();
  }
};
let validateDepartment = async (_rule: Rule, value: string) => {
  if (value) {
    // return Promise.reject("请填写所属部门");
  }
  else {
    return Promise.resolve();
  }
};
let validateEnter_time = async (_rule: Rule, value: string) => {
  if (value.length<2) {
    return Promise.reject("请选择您的在职时间");
  }
  else {
    return Promise.resolve();
  }
};

const rules: Record<string, Rule[]> = {
  enter_time: [{ required: true, validator: validateEnter_time, trigger: "change" }],
  department: [{  validator: validateDepartment, trigger: "change" }],
  company: [{ required: true, validator: validateCompany, trigger: "change" }],
  post: [{ required: true, validator: validatePost, trigger: "change" }],
  industry: [{ required: true, validator: validateIndustry, trigger: "change" }],
  content: [{  required: true, validator: checkContent, trigger: "change" }],
  performance: [{ validator: checkPerformance, trigger: "change" }],
  skill: [{  validator: checkSkill, trigger: "change" }],
};
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
};
const handleFinish =async (values: FormState) => {
  if(!userInfo.value.userId) return message.error('您的账号出现异常了，请您重新登录')
  const skillArr  = JSON.stringify(values.skill) 
  const obj = {...values,skill:skillArr,resume_id:props.resumeId,userId:userInfo.value.userId,enter_time:formState.enter_time[0],leave_time:formState.enter_time[1]}
  if(props.resumeId){
    const res:any = await updateUserResume(obj)
    if(res.code!==200) return message.error('修改失败')
    message.success('修改成功')
    userStore.getUseInfo(userInfo.value.userId)
    props.changeWorkExpForm();
  }else{
    const res:any = await addUserResume(obj)
    if(res.code!==200) return message.error('添加失败')
    message.success('添加成功')
    userStore.getUseInfo(userInfo.value.userId)
    props.changeWorkExpForm();
  }
};
const handleFinishFailed = (errors: any) => {
  // console.log('@@',errors.values.born);
};
const resetForm = () => {
  formRef.value?.resetFields();
  props.changeWorkExpForm(); 
  
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
    .workContent{
      width: 100%;
      min-height: 190px;
      ::v-deep(.ant-input){
        height: auto !important;
      }
    }
    .skillContent{
      width: 100%;
      ::v-deep(.ant-select) {
        width: 100%;
      }
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
