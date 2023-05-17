<template>
  <div class="consult">
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
     <a-select  v-model="form.state" allow-clear  allow-search @change="changeSelect" :disabled="loading" :style="{width:'320px'}" placeholder="请选择公司状态">
      <a-option :value="item.state" v-for="(item,index) in stateList" :key="index">{{ item.name }}</a-option>
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
    <a-table
    :scroll="scroll" :scrollbar="scrollbar"
      class="table"
      @page-change="changePageNation"
      :pagination="pageNationParams"
      :data="positionData"
      :loading="loading"
      
    >
      <template #columns>
        <a-table-column title="公司logo"  data-index="logo">
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
        <a-table-column  ellipsis tooltip :width="140" title="公司名称" data-index="company_name">
          <template #cell="{ record }">
            <span @click="seeCompany(record.position_id)">{{ record.company_name }}</span>
          </template>
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
        <a-table-column title="融资" data-index="financing"></a-table-column>
        <a-table-column title="公司规模" data-index="people_num"></a-table-column>
        <a-table-column title="发布时间" data-index="pos_addTime">
          <template #cell="{ record }">
            <a-tooltip :content="getTime(record.pos_addTime)">
              <span>{{ getTimeBefore(record.pos_addTime) }}</span>
            </a-tooltip>
          </template>
        </a-table-column>
        <a-table-column  title="职位状态" data-index="position_state">
          <template #cell="{ record }">
            <a-tag color="orange" v-if="record.position_state=='0'">待审核</a-tag>
            <a-tag color="green" v-if="record.position_state=='1'">正常</a-tag>
            <a-tag color="red" v-if="record.position_state=='2'">已驳回/已关闭</a-tag>
          </template>
        </a-table-column>
        <a-table-column :width="90" fixed="right" title="切换状态">
          <template #cell="{ record }">
            <a-switch
              :disabled="!useAuth(false) || record.position_state=='0'"
              @change="changeSwitch($event, record.position_id)"
              v-model="record.position_state"
              checked-value="1"
              uncheckedValue="2"
            >
              <template #checked> 正常 </template>
              <template #unchecked> 关闭 </template>
            </a-switch>
          </template>
        </a-table-column>
        <a-table-column fixed="right" :width="180" title="操作" data-index="category">
          <template #cell="{ record }">
            <a-button  :size="btnStyle.select.size" :status="btnStyle.select.status" :type="btnStyle.select.type" @click="seePosition(record.position_id)"
              >职位详情</a-button
            >
            <a-button
            style="margin: 0 10px"
            :type="btnStyle.delete.type"
              :status="btnStyle.delete.status"
              :size="btnStyle.select.size"
              @click="deleteConsult(record.position_id)"
              >删除</a-button
            >
          </template>
        </a-table-column>
      </template>
    </a-table>
   
    <!-- 查看职位详情模态框 -->
    <a-modal
      v-model:visible="selectModel"
      :width="1000"
      :footer="false"
      :mask-closable="false"
    >
      <template #title> 职位详情 </template>
      <SelectPositionDetail :selectPositionData="selectPositionData" />
    </a-modal>
    <!-- 查看公司详情模态框 -->
    <a-modal
    v-model:visible="selectCompanyModel"
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
import SelectPositionDetail from "../components/selectPositionDetail/index.vue";
import SelectCompany from "../components/selectCompany/index.vue";
import {
  publishConsult,
  updateConsult,
  selPositionAll,
  updatePositionState,
  delPosition,
} from "@/api";
import { Message, Modal } from "@arco-design/web-vue";
import { getTime, getTimeBefore } from "@/utils/formatTime";
import { useAuth } from "@/hooks/useAuth";
import {  IconUser,IconSearch,IconRefresh } from "@arco-design/web-vue/es/icon";
import {btnStyle} from "@/config/btnStyle"
import { IPositionData } from "@/types/position";
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
const positionModelVisible = ref(false);
const positionData = ref<IPositionData[]>([]);
const pageNationParams = reactive({
  pageOn: 1,
  pageSize: 15,
  total: 2,
});

const stateList = [
  {state:"0",name:"待审核"},
  {state:"1",name:"正常"},
  {state:"2",name:"已驳回/已关闭"},
]	
const scrollbar = ref(true);
const scroll = {
  x: 2000,
};


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

const loading = ref(false);

//切换公司规模/以及搜索、
const changeSelect = ()=>{
  pageNationParams.pageOn = 1
  getPosition()
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
  getPosition()
}
//获取职位数据
const getPosition = async () => {
  const params = {
    keyword:form.keyword,
    cityName: form.city.length?form.city[1]:'',
		// region: form.city.length?form.city[2]:'',
    position_state:form.state?form.state:'',
    industry:form.industry?form.industry:'',
    financing:form.financing=='不限'?'':form.financing,
    people_num:form.people_num=='不限'?'':form.people_num,
    degrees:form.degrees=='不限'?'':form.degrees,
    salary:form.salary=='不限'?'':form.salary,
    job_type:form.job_type=='不限'?'':form.job_type,
    ...pageNationParams
  }
  loading.value = true;
  const res: any = await selPositionAll(params);
  setTimeout(() => {
    if (res.code !== 200)
      return (positionData.value = []), (loading.value = false);
    loading.value = false;
    positionData.value = res.data;
    pageNationParams.total = res.total;
  }, 400);
};
const changePageNation = (pageOn: number) => {
  document.documentElement.scrollTo({
    top:0,
    behavior:"smooth"
  })
  pageNationParams.pageOn = pageOn;
  getPosition();
};

const changeSwitch = async (state: any, position_id: string) => {
  const res: any = await updatePositionState({ state, position_id });
  if (res.code !== 200) {
    Message.error(res.msg);
    // getPosition();
    return;
  }
  Message.success("状态修改成功");
  getPosition();
};

//提交修改或发布
const validateForm = async (isShow: boolean = true, value: any) => {
  if (!isShow) return (positionModelVisible.value = false);
  if (!useAuth()) return;
  if (value?.position_id) {
    const res: any = await updateConsult(value);
    if (res.code !== 200) {
      return Message.error(res.msg);
    }
    Message.success(res.msg);
    positionModelVisible.value = false;
  } else {
    const res: any = await publishConsult(
      {...value,}
      );
    if (res.code !== 200) {
      return Message.error(res.msg);
    }
    Message.success(res.msg);
    positionModelVisible.value = false;
  }
  getPosition();
};
onMounted(() => {
  getPosition();
});

const itemPosition = ref<IPositionData[]>([]);



const positionModelOk = () => {
  positionModelVisible.value = false;
  itemPosition.value = [];
};

const positionModelCancel = () => {
  positionModelVisible.value = false;
  itemPosition.value = [];
};

const openModelVisible = (position_id?: string) => {
  if (position_id) {
    itemPosition.value = positionData.value?.filter(
      (item) => item.position_id === position_id
    );
  } else {
    itemPosition.value = [];
  }
  positionModelVisible.value = true;
};

//点击职位详情
const selectModel = ref(false);
const selectPositionData = ref<IPositionData[]>([]);
const seePosition = (position_id: string) => {
  if (position_id) {
    selectPositionData.value = positionData.value?.filter(
      (item) => item.position_id === position_id
    );
  }
  selectModel.value = true;
  document.documentElement.scrollTop=0
};
//点击删除
const deleteConsult = (position_id: string) => {
  Modal.warning({
    hideCancel: false,
    title: "温馨提示",
    content: "您确认要永久删除该职位么？",
    onOk: async () => {
      if (!useAuth()) return;
      const res: any = await delPosition(position_id);
      if (res.code !== 200) {
        return Message.error(res.msg);
      }
      Message.success(res.msg);
      getPosition();
    },
  });
};

//点击公司详情
const selectCompanyModel = ref(false);
const selectCompanyData = ref<any[]>([]);
const seeCompany = (position_id: string) => {
  if(!position_id) return
  selectCompanyModel.value = true
  if (position_id) {
    selectCompanyData.value = positionData.value?.filter(
      (item:any) => item.position_id === position_id
    );
  }
  document.documentElement.scrollTop=0
};
</script>

<style lang="less" scoped>
.consult {
  .table {
    margin-top: 20px;
  }
  .select{
    display: flex;
    flex-wrap: wrap;
    .item{
      margin-right: 50px;
      margin-top: 15px;
      .clear{
        margin-left: 14px;
      }
    }
  }
}
.tableTitle {
  display: inline-block;
  max-width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
