<template>
  <a-modal
    :keyboard="false"
    width="1000px"
    :maskClosable="false"
    v-model:visible="visible"
    centered
    title=""
    :footer="null"
  >
    <div class="content">
      <a-steps
      
        v-model:current="current"
        type="navigation"
        size="small"
        :style="stepStyle"
      >
        <a-step disabled title="温馨提示" description="信息告知." />
        <a-step disabled title="公司基本信息" description="完善公司基本信息." />
        <a-step disabled title="公司企业文化" description="完善企业文化信息." />
      </a-steps>
      <div class="step1" v-if="current==0">
        <h1>请先完善您的公司信息，完善并提交。待后台审核通过后您就可以发布职位啦！</h1>
        <h1>请务必认真填写您的公司信息</h1>
        <a-button type="primary" @click="current++">我已知悉，开始吧</a-button>
      </div>
      <div class="companyBaseForm" v-show="current==1">
        <CompanyBaseForm :backStep="backStep" :getData="getData"/>
      </div>
      <div class="companyOthersForm" v-show="current==2" >
        <CompanyOtherForm :getData2="getData2" :backStep="backStep"/>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import CompanyBaseForm from "./components/companyBaseForm/index.vue"
import CompanyOtherForm from "./components/companyOtherForm/index.vue"
import { emitter } from "@/utils/emitter";
import {hrAddCompany} from "@/api"
import { message } from "ant-design-vue";
const router = useRouter()
const current = ref<number>(2);
let visible = ref(true);

onMounted(() => {
  emitter.on("changeCompanyState", (val) => {
    visible.value = true;
  });
});


const hr_id =ref('')
const companyToken =ref('')
emitter.on('sendHrInfo',(val:any)=>{
  hr_id.value = val.hr_id
  companyToken.value = val.companyToken
})
let params = {}


//返回上一步
const backStep = ()=>{
  current.value--
}
//接收公司基本信息数据 step2
const getData = (value:any)=>{
  params = {...params,...value}
  current.value++
}
//接收公司基本福利数据 step3
const getData2 =async (value:any)=>{
 const mewParams = {...params,...value,hr_id:hr_id.value}
 const res:any = await hrAddCompany(mewParams)
 if(res.code!==200) return message.error('绑定公司失败')
 router.replace("/company")
 localStorage.setItem("companyToken",companyToken.value)
  console.log('接收公司全部基本信息数据',mewParams)
}

const handleOk = () => {
  visible.value = false;
  console.log("ok");
};

const stepStyle = {
  marginBottom: "60px",
  boxShadow: "0px -1px 0 0 #e8e8e8 inset",
};
</script>

<style lang="less" scoped>

.content {
  min-height: 500px;
  .step1{
    text-align:center;
    margin-top: 120px;
    h1{
      font-size: 20px;
      margin-bottom: 30px;
    }
    .ant-but{
      margin-top: 10px;
    }
    
  }
}
</style>
