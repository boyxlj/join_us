<template>
  <div class="hoveList hopeJob">
    <div class="tips">编辑求职期望</div>
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
      <a-form-item class="infoItem" name="hope_job_type">
        <span>求职类型</span>
        <a-select
          placeholder="请选择您的求职类型"
          v-model:value="formState.hope_job_type"
          style="width: 120px"
        >
          <a-select-option value="全职">全职</a-select-option>
          <a-select-option value="兼职">兼职</a-select-option>
          <a-select-option value="校招">校招</a-select-option>
          <a-select-option value="实习">实习</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item class="infoItem" name="city">
        <span>工作城市</span>
        <a-cascader
          placeholder="请选择您的工作城市"
          v-model:value="formState.city"
          expand-trigger="hover"
          :show-search="{ filter }"
          :field-names="{
            label: 'name',
            value: 'name',
            children: 'subLevelModelList',
          }"
          :options="provinceAndCityList"
        />
      </a-form-item>
      <a-form-item class="infoItem" name="hope_job">
        <span>期望职位</span>
        <a-input
          v-model:value.trim="formState.hope_job"
          type="text"
          autocomplete="off"
          @click="openHopeJobModel"
          placeholder="请填写您期望的职位"
        />
      </a-form-item>

      <a-form-item class="infoItem" name="hope_industry">
        <span>期望行业</span>
        <a-input
          v-model:value.trim="formState.hope_industry"
          type="text"
          autocomplete="off"
          @click="openIndustryModel"
          placeholder="请填写您的期望的行业"
        />
      </a-form-item>
      <a-form-item class="infoItem salaryForm" name="salaryStart">
        <span>薪资要求</span>
        <div class="salary">
          <a-select
            placeholder="请选择薪资区间"
            v-model:value="formState.salaryStart"
          >
            <a-select-option value="面议">面议</a-select-option>
            <a-select-option :value="item + 'k'" v-for="item in 30" :key="item"
              >{{ item }}k</a-select-option
            >
          </a-select>
          <span class="zhi" v-show="formState.salaryStart !== '面议'">至</span>
        </div>
      </a-form-item>
      <div class="salaryEnd" v-show="formState.salaryStart !== '面议'">
        <a-select
          placeholder="请选择薪资区间"
          v-model:value="formState.salaryEnd"
          style="width: 120px"
          @change="changeSalaryEnd"
        >
          <a-select-option :value="item + 'k'" v-for="item in 30" :key="item"
            >{{ item }}k</a-select-option
          >
        </a-select>
      </div>
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
                :key="item.id"
                >{{ item.industry_name }}</span
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
import type { FormInstance } from "ant-design-vue";
import { message } from "ant-design-vue";
import { useCity } from "@/store/city";
import { useJobTypeStore } from "@/store/positionType";
import { IPositionType1 } from "@/types/jobType";
import Empty from "@/components/common/empty/index.vue";
import type { ShowSearchType } from "ant-design-vue/es/cascader";
import {useUserInfo} from "@/store/user"
import {useIndustryStore} from "@/store/industry"
import {IIndustryData} from "@/types/industry"
import {IUserInfo} from "@/types/userInfo"
const userStore = useUserInfo()
const {industryList} =  useIndustryStore()
const { provinceAndCityList } = useCity();
const props = withDefaults(defineProps<{ changeHopeJobForm: any ,userInfo:IUserInfo}>(), {});
onMounted(()=>{
  if(props.userInfo.hope_salary){
    if(props.userInfo.hope_salary=='面议'){
      formState.salaryStart = props.userInfo.hope_salary
      formState.salaryEnd = undefined;
    }else{
      formState.salaryStart = props.userInfo.hope_salary?.split('-')[0]
      formState.salaryEnd = props.userInfo.hope_salary?.split('-')[1]
    }
  }else{
    formState.salaryStart = undefined;
    formState.salaryEnd = undefined;
  }
  if( props.userInfo.hope_city){
    formState.city = [props.userInfo.hope_city?.split('-')[0],props.userInfo.hope_city?.split('-')[1]]
  }else{
    formState.city=[]
  }
  formState.hope_job=props.userInfo.hope_job
  formState.hope_industry=props.userInfo.hope_industry
  formState.hope_job_type=props.userInfo.hope_job_type?props.userInfo.hope_job_type:undefined
})


const filter: ShowSearchType["filter"] = (inputValue, path) => {
  return path.some((option) => option.name.indexOf(inputValue) > -1);
};

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
  formState.hope_job = hopeJob
}

//-----------期望行业

// const industryList = ['计算机软件','电子商务','游戏','媒体广告','营销数据服务','医疗健康']
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
  formState.hope_industry = industry
}

interface FormState {
  hope_job_type: string  | undefined;
  city: string|any[];
  salaryStart: string | undefined;
  hope_job: string;
  salaryEnd: string  | undefined;
  hope_industry: string;
}
const monthFormat = "YYYY/MM";
const formRef = ref<FormInstance>();
const formState = reactive<FormState>({
  city: "",
  salaryStart: undefined,
  salaryEnd: undefined,
  hope_job: "",
  hope_industry: "",
  hope_job_type: undefined,
});

let checkHope_job = async (_rule: Rule, value: string) => {
  if (!value) {
    return Promise.reject("请选择您的期望职位");
  } else {
    return Promise.resolve();
  }
};
let checkHope_job_type = async (_rule: Rule, value: string) => {
  if (!value) {
    return Promise.reject("请选择您的求职类型");
  } else {
    return Promise.resolve();
  }
};
let checkCity = async (_rule: Rule, value: string) => {
  if (!value) {
    return Promise.reject("请选择您的期望城市");
  } else {
    return Promise.resolve();
  }
};
let checkHope_industry = async (_rule: Rule, value: string) => {
  if (!value) {
    return Promise.reject("请选择您的期望行业");
  } else {
    return Promise.resolve();
  }
};
let checkSalary = async (_rule: Rule, value: string) => {
  const salaryStart = Number(value?.slice(0, value.length - 1));
  const salaryEnd = Number(
    formState.salaryEnd?.slice(0, formState.salaryEnd.length - 1)
  );
  if (!value) {
    return Promise.reject("请选择您的期望薪资");
  } else if (value) {
    if (salaryEnd) {
      if (salaryEnd <= salaryStart) {
        return Promise.reject("请选择合法的期望薪资");
      }
    }
  } else {
    return Promise.resolve();
  }
};
const changeSalaryEnd = async () => {
  await formRef.value?.validateFields(["salaryStart"]);
};
const rules: Record<string, Rule[]> = {

  hope_job: [{ required: true, validator: checkHope_job, trigger: "change" }],
  hope_job_type: [{ required: true, validator: checkHope_job_type, trigger: "change" }],
  hope_industry: [{ required: true, validator: checkHope_industry, trigger: "change" }],
  city: [{ required: true, validator: checkCity, trigger: "change" }],
  salaryStart: [{ required: true, validator: checkSalary, trigger: "change" }],
};
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
};
const handleFinish =async (values: FormState) => {
  if (formState.salaryStart !== "不限" && !formState.salaryEnd) {
    return message.warning("期望薪资填写有误");
  }
  const obj = 
    {...formState,
    hope_city:formState.city[0]+'-'+formState.city[1],
    hope_salary:values.salaryStart=='面议'?'面议':`${values.salaryStart}-${formState.salaryEnd}`}
  
  const res =await userStore.updateUseInfo(obj)
  if(res===200){
     props.changeHopeJobForm();
  }
};
const handleFinishFailed = (errors: any) => {
  // console.log('@@',errors.values.born);
};
const resetForm = () => {
  formRef.value?.resetFields();
  props.changeHopeJobForm();
};
const handleValidate = (...args: any) => {
  // console.log(args);
};
</script>

<style lang="less" scoped>
.hopeJob {
  width: 100%;
  height: 350px;
  padding: 24px 20px;
  box-sizing: border-box;
  background: #f1f1f1;
  user-select: none;
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
    position: relative;
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
      }
    }
    .salaryForm {
      .salary {
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }
      ::v-deep(.ant-select) {
        width: 43% !important;
      }
      .zhi {
        margin-left: 22px;
      }
    }
    .salaryEnd {
      position: absolute;
      bottom: -4px;
      left: 200px;
      width: 43% !important;
      ::v-deep(.ant-select) {
        width: 43% !important;
        .ant-select-selector {
          height: 40px;
          border-radius: 0;
        }
      }
    }
    .buttons {
      width: 20%;
      right: 0;
      position: absolute;
      bottom: -28px;
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
