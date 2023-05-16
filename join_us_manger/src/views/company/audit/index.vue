<template>
  <div>
    <a-tabs :active-key="activeIdx" @change="changeTabs">
    <a-tab-pane key="0" title="待审核">
    </a-tab-pane>
    <a-tab-pane key="1" title="已通过">
    </a-tab-pane>
    <a-tab-pane key="2" title="已驳回">
    </a-tab-pane>
  </a-tabs>
  <a-table
      class="table"
      @page-change="changePageNation"
      :pagination="pageNationParams"
      :data="companyData"
      :loading="loading"
    >
      <template #columns>
        <a-table-column title="公司logo" data-index="logo">
          <template #cell="{ record }">
            <a-avatar
            shape="square"
              :size="50"
              v-if="record.logo"
              :imageUrl="record.logo"
            ></a-avatar>
            <a-avatar shape="square" v-else>
              <IconUser />
            </a-avatar>
          </template>
        </a-table-column>
        <a-table-column title="标题" data-index="title">
          <template #cell="{ record }">
            <a-tooltip :content="record.company_name">
              <span class="tableTitle">{{ record.company_name }}</span>
            </a-tooltip>
          </template>
        </a-table-column>
        <a-table-column title="注册城市" data-index="reg_city">
          <template #cell="{ record }">
            <span>{{ record.reg_city }} <span v-if="record.region"> · </span> {{ record.region }}</span>
          </template>
        </a-table-column>
        <a-table-column title="行业" data-index="industry"></a-table-column>
        <a-table-column title="规模" data-index="people_num"></a-table-column>
        <a-table-column title="融资" data-index="financing"></a-table-column>
        <a-table-column title="成立时间" data-index="create_time">
          <template #cell="{ record }">
            <a-tooltip :content="getTime(record.create_time)">
              <span>{{ getTimeBefore(record.create_time) }}</span>
            </a-tooltip>
          </template>
        </a-table-column>
        <a-table-column title="申请时间" data-index="addTime">
          <template #cell="{ record }">
            <a-tooltip :content="getTime(record.addTime)">
              <span>{{ getTimeBefore(record.addTime) }}</span>
            </a-tooltip>
          </template>
          
        </a-table-column>
        <a-table-column title="状态" data-index="state">
          <template #cell="{ record }">
            <a-tag color="orange" v-if="record.state=='0'">待审核</a-tag>
            <a-tag color="green" v-if="record.state=='1'">审核通过</a-tag>
            <a-tag color="red" v-if="record.state=='2'">已驳回/关闭</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="操作" data-index="category">
          <template #cell="{ record }">
            <a-button  style="margin: 0 4px"  :size="btnStyle.select.size" :status="btnStyle.select.status"  type="outline" @click="seeCompany(record.company_id)"
              >查看详情</a-button
            >
            <a-button
            v-if="record.state==0 || record.state==2"
            style="margin: 0 4px"
            type="outline"
              status="success"
              :disabled="!useAuth(false)"
              :size="btnStyle.select.size"
              @click="changeState(record.company_id,'1')"
              >通过</a-button
            >
            <a-button
            v-if="record.state==2"
            style="margin: 0 4px"
            type="outline"
              status="warning"
              :size="btnStyle.select.size"
              :disabled="!useAuth(false)"
              @click="changeState(record.company_id,'0')"
              >重新审核</a-button
            >
            <a-button
            v-if="record.state==0 || record.state==1"
            style="margin: 0 4px"
            type="outline"
            :disabled="!useAuth(false)"
            :size="btnStyle.select.size"
              :status="btnStyle.delete.status"
              @click="changeState(record.company_id,'2')"
              >驳回</a-button
            >
           
          </template>
        </a-table-column>
      </template>
    </a-table>
     <!-- 查看模态框 -->
     <a-modal
      v-model:visible="selectModel"
      :width="1000"
      :footer="false"
      :mask-closable="false"
    >
      <template #title> 公司详情 </template>
      <SelectCompany :selectCompanyData="selectCompanyData" />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import {selCompanyAll,updateCompanyState} from "@/api"
import { ICompanyData } from "@/types/company";
import {Message} from "@arco-design/web-vue"
import { getTime, getTimeBefore } from "@/utils/formatTime";
import { useAuth } from "@/hooks/useAuth";
import {  IconUser } from "@arco-design/web-vue/es/icon";
import {btnStyle} from "@/config/btnStyle"
import SelectCompany from "../components/selectCompany/index.vue";
const route = useRoute()
const router = useRouter()
const activeIdx = ref(0)
const loading = ref(false)
const pageNationParams = reactive({
  pageOn: 1,
  pageSize: 15,
  total: 2,
});
const companyData = ref<ICompanyData[]>([]);

//审核公司
const changeState =async (company_id:string,state:string)=>{
  if(!useAuth()) return
  const res: any = await updateCompanyState({ state, company_id });
  if (res.code !== 200) {
    Message.error(res.msg);
    // getCompany();
    return;
  }
let str= ''
if(state=='0'){
  str ='已设置为待审核状态'
}else if(state=='1'){
  str ='已通过该公司的入驻申请'
}else if(state=='2'){
  str ='已拒绝该公司的入驻申请'
}
  Message.success(str);
  getCompany();
}
//获取公司数据
const getCompany = async () => {
  loading.value = true;
  const res: any = await selCompanyAll({...pageNationParams,state:activeIdx.value+''});
  setTimeout(() => {
    if (res.code !== 200)
      return (companyData.value = []), (loading.value = false);
    loading.value = false;
    companyData.value = res.data;
    pageNationParams.total = res.total;
  }, 200);
};

const changePageNation = (pageOn: number) => {
  document.documentElement.scrollTo({
    top:0,
    behavior:"smooth"
  })
  pageNationParams.pageOn = pageOn;
  getCompany();
};
//点击查看
const selectModel = ref(false);
const selectCompanyData = ref<ICompanyData[]>([]);
const seeCompany = (company_id: string) => {
  if (company_id) {
    selectCompanyData.value = companyData.value?.filter(
      (item) => item.company_id === company_id
    );
  }
  selectModel.value = true;
  document.documentElement.scrollTop=0
};
onMounted(()=>{
  const tags = (route.query.tag as any) * 1;
  if (!tags) {
    router.push(`/company/audit?tag=${0}`);
  } else if(tags>2 || tags<0){
    activeIdx.value = 0
    router.push(`/company/audit?tag=${0}`);
  }else {
    activeIdx.value = tags
  }
  getCompany()
})

watch(
  () => route.fullPath,
  () => {
    activeIdx.value = (route.query.tag as any) * 1;
  }
);

const changeTabs = (key:string|number)=>{
  activeIdx.value = key as number
  router.push(`/company/audit?tag=${key}`);
  getCompany()
}


</script>

<style lang='less' scoped> 

</style>