<template>
  <div>
    <div  class="select">
    <li class="item">
    <a-cascader path-mode allow-clear  allow-search v-model="form.city"  :disabled="loading" :options="allCityList" 
    :field-names="{value: 'name', label: 'name',children:'subLevelModelList'}" 
    expand-trigger="hover"
     :style="{width:'320px'}" 
     @change="changeSelect" placeholder="请选择城市和区域" /></li>
    <li class="item">
     <a-select  v-model="form.people_num" allow-clear  allow-search @change="changeSelect" :disabled="loading" :style="{width:'320px'}" placeholder="请选择公司规模">
      <a-option v-for="(item,index) in people_numList" :key="index">{{ item.name }}</a-option>
    </a-select></li>
     <li class="item">
     <a-select v-model="form.financing" allow-clear  allow-search @change="changeSelect"  :disabled="loading" :style="{width:'320px'}" placeholder="请选择融资情况">
      <a-option   v-for="(item,index) in financingList" :key="index">{{ item.name }}</a-option>
    </a-select></li>
    <li class="item">
     <a-select  v-model="form.industry" allow-clear  allow-search @change="changeSelect" :disabled="loading" :style="{width:'320px'}" placeholder="请选择行业类型">
      <a-option  v-for="(item,index) in industryData" :key="index">{{ item.industry_name }}</a-option>
    </a-select></li>
  
    <li class="item">
     <a-select  v-model="form.job_type" allow-clear  allow-search @change="changeSelect" :disabled="loading" :style="{width:'320px'}" placeholder="请选择职位类型">
      <a-option  v-for="(item,index) in job_typeList" :key="index">{{ item.name }}</a-option>
    </a-select></li>
    <li class="item">
     <a-select  v-model="form.salary" allow-clear  allow-search @change="changeSelect" :disabled="loading" :style="{width:'320px'}" placeholder="请选择薪资范围">
      <a-option  v-for="(item,index) in salaryList" :key="index">{{ item.name }}</a-option>
    </a-select></li>
    <li class="item">
     <a-select  v-model="form.degrees" allow-clear  allow-search @change="changeSelect" :disabled="loading" :style="{width:'320px'}" placeholder="请选择学历要求">
      <a-option  v-for="(item,index) in degreesList" :key="index">{{ item.name }}</a-option>
    </a-select></li>
    <li class="item">
      <a-input-search  @clear="changeSelect" @search="changeSelect"  @press-enter="changeSelect" allow-clear  allow-search v-model.trim="form.keyword" :disabled="loading "  :style="{width:'320px'}" placeholder="请输入职位名称或公司名称" search-button>
        <template #button-icon>
          <icon-search />
        </template>
        <template #button-default >
          查询
        </template>
      </a-input-search>
      <a-button  class="clear" @click="clearSelect">
      <template #icon>
        <icon-refresh/>
      </template>
      <template #default>重置</template>
      </a-button>
    </li>
    </div>
    <a-tabs  :active-key="activeIdx" @change="changeTabs">
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
      :data="positionData"
      :loading="loading"
      :scroll="scroll" :scrollbar="scrollbar"
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
        <a-table-column ellipsis tooltip :width="140" title="公司名称" data-index="company_name">
        </a-table-column>
        <a-table-column ellipsis tooltip :width="140"  fixed="left" title="职位名称" data-index="position_name">
        </a-table-column>
        <a-table-column title="工作城市" data-index="cityName">
          <template #cell="{ record }">
            <span>{{ record.cityName }} <span v-if="record.region"> · </span> {{ record.region }}</span>
          </template>
        </a-table-column>
        <a-table-column title="行业" data-index="industry"></a-table-column>
        <a-table-column title="职位类型" data-index="job_type">
          <template #cell="{ record }">
            <a-tag color="pinkpurple">{{ record.job_type }}</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="薪资" data-index="salary"></a-table-column>
        <a-table-column title="学历要求" data-index="degrees"></a-table-column>
        <a-table-column title="工作经验" data-index="experiences"></a-table-column>
        <a-table-column title="公司规模" data-index="people_num"></a-table-column>
        <a-table-column title="申请时间" data-index="pos_addTime">
          <template #cell="{ record }">
            <a-tooltip :content="getTime(record.pos_addTime)">
              <span>{{ getTimeBefore(record.pos_addTime) }}</span>
            </a-tooltip>
          </template>
        </a-table-column>
       
        <a-table-column  fixed="right" :width="100"  title="职位状态" data-index="position_state">
          <template #cell="{ record }">
            <a-tag color="orange" v-if="record.position_state=='0'">待审核</a-tag>
            <a-tag color="green" v-if="record.position_state=='1'">审核通过</a-tag>
            <a-tag color="red" v-if="record.position_state=='2'">已驳回/关闭</a-tag>
          </template>
        </a-table-column>
        <a-table-column fixed="right" :width="$route.query.tag=='1'?180:290" title="操作" data-index="category">
          <template #cell="{ record }">
            <a-button  style="margin: 0 4px"  :size="btnStyle.select.size" :status="btnStyle.select.status"  type="outline" @click="seeCompany(record.position_id)"
              >查看详情</a-button
            >
            <a-button
            v-if="record.position_state==0 || record.position_state==2"
            style="margin: 0 4px"
            type="outline"
              status="success"
              :disabled="!useAuth(false)"
              :size="btnStyle.select.size"
              @click="changeState(record.position_id,'1')"
              >通过</a-button
            >
            <a-button
            v-if="record.position_state==2"
            style="margin: 0 4px"
            type="outline"
              status="warning"
              :size="btnStyle.select.size"
              :disabled="!useAuth(false)"
              @click="changeState(record.position_id,'0')"
              >重新审核</a-button
            >
            <a-button
            v-if="record.position_state==0 || record.position_state==1"
            style="margin: 0 4px"
            type="outline"
            :disabled="!useAuth(false)"
            :size="btnStyle.select.size"
              :status="btnStyle.delete.status"
              @click="changeState(record.position_id,'2')"
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
      <template #title> 职位详情 </template>
      <SelectPositionDetail :selectPositionData="selectPositionData" />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import {selPositionAll,updatePositionState} from "@/api"
import { IPositionData } from "@/types/position";
import {Message} from "@arco-design/web-vue"
import { getTime, getTimeBefore } from "@/utils/formatTime";
import { useAuth } from "@/hooks/useAuth";
import {  IconUser } from "@arco-design/web-vue/es/icon";
import {btnStyle} from "@/config/btnStyle"
import SelectPositionDetail from "../components/selectPositionDetail/index.vue";
import {useIndustryStore} from "@/store/industry"
import {useCity} from "@/store/city"
import {useGetConditionData} from "@/store/condition"
const {industryData}  =  useIndustryStore() as any
const {allCityList} = useCity()
const conditions =  useGetConditionData().conditionData
const financingList = conditions[conditions.length-1]
const people_numList = conditions[conditions.length-2]
const job_typeList = conditions[0]
const salaryList = conditions[2]
const degreesList = conditions[3]
const route = useRoute()
const router = useRouter()
const activeIdx = ref(0)
const loading = ref(false)
const pageNationParams = reactive({
  pageOn: 1,
  pageSize: 15,
  total: 2,
});
const positionData = ref<IPositionData[]>([]);
  const scroll = {
  x: 2000,
};
const scrollbar = ref(true);

const form = reactive({
  financing:'',
  people_num:'',
  city:'',
  keyword:'',
  state:'',
  industry:'',
  job_type:'',
  salary:'',
  degrees:'',

})
//切换公司规模/以及搜索、
const changeSelect = ()=>{
  pageNationParams.pageOn = 1
  getCompany()
}
//重置
const clearSelect = ()=>{
  form.financing = ''
  form.people_num = ''
  form.city = ''
  form.keyword = ''
  form.state = ''
  form.industry = ''
  form.job_type = ''
  form.salary = ''
  form.degrees = ''
  pageNationParams.pageOn = 1
  getCompany()
}

//审核公司
const changeState =async (position_id:string,state:string)=>{
  if(!useAuth()) return
  const res: any = await updatePositionState({ state, position_id });
  if (res.code !== 200) {
    Message.error(res.msg);
    // getCompany();
    return;
  }
let str= ''
if(state=='0'){
  str ='已设置为待审核状态'
}else if(state=='1'){
  str ='已通过该职位的发布'
}else if(state=='2'){
  str ='已拒绝该职位的发布'
}
  Message.success(str);
  getCompany();
}
//获取公司数据
const getCompany = async () => {
  loading.value = true;
  const params = {
    keyword:form.keyword,
    cityName: form.city.length?form.city[1]:'',
		// region: form.city.length?form.city[2]:'',
    position_state:activeIdx.value+'',
    industry:form.industry?form.industry:'',
    financing:form.financing=='不限'?'':form.financing,
    people_num:form.people_num=='不限'?'':form.people_num,
    degrees:form.degrees=='不限'?'':form.degrees,
    salary:form.salary=='不限'?'':form.salary,
    job_type:form.job_type=='不限'?'':form.job_type,
    ...pageNationParams
  }
  const res: any = await selPositionAll(params);
  setTimeout(() => {
    if (res.code !== 200)
      return (positionData.value = []), (loading.value = false);
    loading.value = false;
    positionData.value = res.data;
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
const selectPositionData = ref<IPositionData[]>([]);
const seeCompany = (position_id: string) => {
  if (position_id) {
    selectPositionData.value = positionData.value?.filter(
      (item) => item.position_id === position_id
    );
  }
  selectModel.value = true;
  document.documentElement.scrollTop=0
};
onMounted(()=>{
  const tags = (route.query.tag as any) * 1;
  if (!tags) {
    router.push(`/position/audit?tag=${0}`);
  } else if(tags>2 || tags<0){
    activeIdx.value = 0
    router.push(`/position/audit?tag=${0}`);
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
  router.push(`/position/audit?tag=${key}`);
  getCompany()
}


</script>

<style lang='less' scoped> 
 .select{
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;
    .item{
      margin-right: 50px;
      margin-top: 15px;
      display: flex;
      align-items: center;
      .clear{
        margin-left: 14px;
      }
    }
  }
</style>