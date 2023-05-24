<template>
  <div class="manger">
    <div class="select">
    <li class="item">
      <a-input-search  @clear="changeSelect" @search="changeSelect"  @press-enter="changeSelect" allow-clear  allow-search v-model.trim="keyword" :disabled="loading "  :style="{width:'320px'}" placeholder="请输入行业关键字查询" search-button>
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
    </li></div>
    <a-table
    :scroll="scroll" :scrollbar="scrollbar"
      class="table"
      @page-change="changePageNation"
      :pagination="pageNationParams"
      :data="hrData"
      :loading="loading"
    >
      <template #columns>
        <a-table-column title="人事头像" data-index="avatar">
          <template #cell="{ record }">
            <a-avatar
            shape="square"
              :size="50"
              v-if="record.avatar"
              :imageUrl="record.avatar"
            ></a-avatar>
            <a-avatar shape="square" v-else>
              <IconUser />
            </a-avatar>
          </template>
        </a-table-column>
       
        <a-table-column title="昵称" data-index="name">
          <template #cell="{ record }">
            <span>{{ record.name || '/'}}</span>
          </template>
        </a-table-column>
        <a-table-column title="账号" data-index="telephone"></a-table-column>
        <a-table-column title="身份" data-index="hr_identity"></a-table-column>
        <a-table-column title="所属公司" data-index="title">
          <template #cell="{ record }">
            <a-tooltip :content="record.company_name">
              <span class="tableTitle">{{ record.company_name }}</span>
            </a-tooltip>
          </template>
        </a-table-column>
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
        <a-table-column title="注册城市" data-index="reg_city">
          <template #cell="{ record }">
            <span>{{ record.reg_city }} <span v-if="record.region"> · </span> {{ record.region }}</span>
          </template>
        </a-table-column>
        <a-table-column title="行业" data-index="industry"></a-table-column>
        <a-table-column title="规模" data-index="people_num"></a-table-column>
        <a-table-column title="融资" data-index="financing"></a-table-column>
        <a-table-column title="注册时间" data-index="reg_time">
          <template #cell="{ record }">
            <a-tooltip :content="getTime(record.reg_time, 'time')">
              <span>{{ getTimeBefore(record.reg_time) }}</span>
            </a-tooltip>
          </template>
        </a-table-column>
        <a-table-column fixed="right" :width="100" title="公司状态" data-index="state">
          <template #cell="{ record }">
            <a-tag color="orange" v-if="record.state=='0'">待审核</a-tag>
            <a-tag color="green" v-if="record.state=='1'">当前正常</a-tag>
            <a-tag color="red" v-if="record.state=='2'">已驳回/关闭</a-tag>
          </template>
        </a-table-column>
        <a-table-column fixed="right" :width="100" title="人事状态" data-index="hr_state">
          <template #cell="{ record }">
            <a-tooltip content="账号异常!该人事将无法发布新岗位">
             <a-tag color="red" v-if="record.hr_state=='0'">账号异常</a-tag> 
            </a-tooltip>
            <a-tag color="green" v-if="record.hr_state=='1'">正常</a-tag>
          </template>
        </a-table-column>
      
        <a-table-column  fixed="right" :width="100" title="切换状态">
          <template #cell="{ record }">
            <a-switch
              :disabled="!useAuth(false) "
              @change="changeSwitch($event, record.hr_id)"
              v-model="record.hr_state"
              checked-value="1"
              uncheckedValue="0"
            >
              <template #checked> 正常 </template>
              <template #unchecked> 关闭 </template>
            </a-switch>
          </template>
        </a-table-column>
        <a-table-column fixed="right" :width="100" title="操作" data-index="category">
          <template #cell="{ record }">
           
            <!-- <a-button
            :size="btnStyle.select.size"
              style="margin: 0 10px"
              :type="btnStyle.editor.type"
              :status="btnStyle.editor.status"
              @click="openModelVisible(record.hr_id)"
              >编辑</a-button
            > -->
            <a-button
            :size="btnStyle.select.size"
            :type="btnStyle.delete.type"
              :status="btnStyle.delete.status"
              @click="deleteIndustry(record.hr_id)"
              >删除</a-button
            >
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { IconUser,IconSearch,IconRefresh } from "@arco-design/web-vue/es/icon";
// import IndustryForm from "./components/industryForm/index.vue";
import {
  addIndustry,
  selHrAll,
  updateIndustry,
  delHr,
  updateHrState,
} from "@/api";
import { Message, Modal } from "@arco-design/web-vue";
import { getTime, getTimeBefore } from "@/utils/formatTime";
import { IHrData } from "@/types/hr";
import { useAuth } from "@/hooks/useAuth";
import {btnStyle} from "@/config/btnStyle"
import {useMangerStore} from "@/store/manger"
const hrModelVisible = ref(false);
const hrData = ref<IHrData[]>([]);
const pageNationParams = reactive({
  pageOn: 1,
  pageSize: 15,
  total: 2,
});

const scrollbar = ref(true);
const scroll = {
  x: 2000,
};
const scrollPercent = {
  x: '120%',
  y: '100%'
};

//搜索
const keyword=ref('')
const changeSelect =  ()=>{
  pageNationParams.pageOn = 1
  getHrs();
}
const clearSelect = ()=>{
  pageNationParams.pageOn = 1
  keyword.value = ''
  getHrs();
}
const changePageNation = (pageOn: number) => {
  pageNationParams.pageOn = pageOn;
  getHrs();
};
onMounted(() => {
  getHrs();
});

const changeSwitch = async (state: any, hr_id: string) => {
  const res: any = await updateHrState({ state, hr_id });
  if (res.code !== 200) {
    Message.error(res.msg);
    getHrs();
    return;
  }
  Message.success("人事状态修改成功");
  getHrs();
};

//提交添加或修改
const validateForm = async (isShow: boolean = true, value: any) => {
  if (!isShow) return (hrModelVisible.value = false);
  if (!useAuth()) return;

  if (value?.hr_id) {
    const res: any = await updateIndustry(value);
    if (res.code !== 200) {
      return Message.error(res.msg);
    }
    Message.success(res.msg);
    hrModelVisible.value = false;
  } else {
    const res: any = await addIndustry({...value});
    if (res.code !== 200) {
      return Message.error(res.msg);
    }
    Message.success(res.msg);
    hrModelVisible.value = false;
  }
  
  getHrs();
};

const itemHr = ref<IHrData[]>([]);

const loading = ref(false);
//获取人事数据
const getHrs = async () => {
  loading.value = true;
  const res: any = await selHrAll({...pageNationParams,keyword:keyword.value});
  setTimeout(() => {
    if (res.code !== 200)
      return (hrData.value = []), (loading.value = false);
    loading.value = false;
    hrData.value = res.data;
    pageNationParams.total = res.total;
  }, 400);
};

const hrModelOk = () => {
  hrModelVisible.value = false;
  itemHr.value = [];
};

const hrModelCancel = () => {
  hrModelVisible.value = false;
  itemHr.value = [];
};

const openModelVisible = (hr_id?: string) => {
  hrModelVisible.value = true;
  if (hr_id) {
    itemHr.value = hrData.value?.filter(
      (item) => item.hr_id === hr_id
    );
  }else{
    itemHr.value =[]
  }
};


//点击删除
const deleteIndustry = (hr_id: string) => {
  Modal.warning({
    hideCancel: false,
    title: "温馨提示",
    content: "您确认要永久删除该人事账号吗?(与此同时该人事所发布的所有职位也将同步删除)",
    onOk: async () => {
      if (!useAuth()) return;
      const res: any = await delHr(hr_id);
      if (res.code !== 200) {
        return Message.error(res.msg);
      }
      Message.success(res.msg);
      getHrs();
    },
  });
};
</script>

<style lang="less" scoped>
.manger {
  .table {
    margin-top: 20px;
  }
  .select{
    display: flex;
    .item{
      .clear{
        margin-left: 12px;
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
.mangerInfo{
  display: flex;
  align-items: center;
  position: relative;
  padding-bottom: 30px;
  min-width: 130px;
  .info{
    margin-left: 10px;
  }
  .timer{
    position: absolute;
    bottom: 2px;
  }
}
</style>
