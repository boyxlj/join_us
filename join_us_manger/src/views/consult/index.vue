<template>
  <div class="consult">
    <div class="select">
    <a-button type="primary" @click="openModelVisible()">发布资讯</a-button>
    <li class="item">
      <a-select style="margin-right: 10px;" v-model="category" allow-clear  allow-search @change="changeSelect" :disabled="loading" :style="{width:'320px'}" placeholder="请选择资讯分类">
      <a-option :value="item.categoryName" v-for="(item,index) in consultCategoryData" :key="index">{{ item.categoryName }}</a-option>
    </a-select>
      <a-input-search 
       @clear="changeSelect" 
       @search="changeSelect" 
        @press-enter="changeSelect" allow-clear  
        allow-search v-model.trim="keyword" 
        :disabled="loading "  
        :style="{width:'360px'}" 
        placeholder="请输入资讯标题或分类等关键字查询" 
        search-button>
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
      class="table"
      @page-change="changePageNation"
      :pagination="pageNationParams"
      :data="consultData"
      :loading="loading"
    >
      <template #columns>
        <a-table-column title="头像" data-index="manger_id">
          <template #cell="{ record }">
            <a-avatar
              :size="50"
              v-if="record.avatar"
              :imageUrl="record.avatar"
            ></a-avatar>
            <a-avatar v-else>
              <IconUser />
            </a-avatar>
          </template>
        </a-table-column>
        <a-table-column title="发布者" data-index="name"></a-table-column>
        <a-table-column title="标题" data-index="title">
          <template #cell="{ record }">
            <a-tooltip :content="record.title">
              <span class="tableTitle">{{ record.title }}</span>
            </a-tooltip>
          </template>
        </a-table-column>
        <a-table-column title="分类" data-index="category">
          <template #cell="{ record }">
            <a-tag color="arcoblue">{{ record.category }}</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="状态">
          <template #cell="{ record }">
            <a-switch
              :disabled="!useAuth(false)"
              @change="changeSwitch($event, record.consult_id)"
              v-model="record.state"
              checked-value="1"
              uncheckedValue="0"
            >
              <template #checked> 正常 </template>
              <template #unchecked> 隐藏 </template>
            </a-switch>
          </template>
        </a-table-column>
        <a-table-column title="发布时间" data-index="publish_time">
          <template #cell="{ record }">
            <a-tooltip :content="getTime(record.publish_time, 'time')">
              <span>{{ getTimeBefore(record.publish_time) }}</span>
            </a-tooltip>
          </template>
        </a-table-column>
        <a-table-column title="操作" data-index="category">
          <template #cell="{ record }">
            <a-button  :size="btnStyle.select.size"  :status="btnStyle.select.status" :type="btnStyle.select.type" @click="seeConsult(record.consult_id)"
              >查看</a-button
            >
            <a-button
            :type="btnStyle.editor.type"
              style="margin: 0 10px"
              :status="btnStyle.editor.status"
              :size="btnStyle.select.size"
              @click="openModelVisible(record.consult_id)"
              >编辑</a-button
            >
            <a-button
            :type="btnStyle.delete.type"
              :status="btnStyle.delete.status"
              :size="btnStyle.select.size"
              @click="deleteConsult(record.consult_id)"
              >删除</a-button
            >
          </template>
        </a-table-column>
      </template>
    </a-table>
    <!-- 发布、修改资讯对话框 -->
    <a-modal
      :footer="false"
      :width="1200"
      :mask-closable="false"
      v-model:visible="consultModelVisible"
      @ok="consultModelOk"
      @cancel="consultModelCancel"
    >
      <template #title>{{
        itemConsult.length ? "编辑资讯" : "发布资讯"
      }}</template>
      <ConsultForm
        :consultModelVisible="consultModelVisible"
        :validateForm="validateForm"
        :itemConsult="itemConsult"
      />
    </a-modal>
    <!-- 查看模态框 -->
    <a-modal
      v-model:visible="selectModel"
      :width="1200"
      :footer="false"
      :mask-closable="false"
    >
      <template #title> 查看资讯 </template>
      <SelectConsult :selectConsultData="selectConsultData" />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import ConsultForm from "./components/consultForm/index.vue";
import SelectConsult from "./components/selectConsult/index.vue";
import {
  publishConsult,
  updateConsult,
  selectConsult,
  updateConsultState,
  delConsult,
} from "@/api";
import { Message, Modal } from "@arco-design/web-vue";
import { getTime, getTimeBefore } from "@/utils/formatTime";
import { IConsultData } from "@/types/consult";
import { IMangerData } from "@/types/manger";
import { useAuth } from "@/hooks/useAuth";
import {useMangerStore} from "@/store/manger"
import {useConsultStore} from "@/store/consult"
import {  IconUser,IconSearch,IconRefresh } from "@arco-design/web-vue/es/icon";
import {btnStyle} from "@/config/btnStyle"
const consultModelVisible = ref(false);
const consultData = ref<IConsultData[]>([]);
const {consultCategoryData} =  useConsultStore()
const pageNationParams = reactive({
  pageOn: 1,
  pageSize: 15,
  total: 2,
});

//搜索
const keyword=ref('')
const category = ref('')  //select 父级选中分类
const changeSelect =  ()=>{
  pageNationParams.pageOn = 1
  getConsult();
}
const clearSelect = ()=>{
  pageNationParams.pageOn = 1
  keyword.value = ''
  getConsult();
}
const changePageNation = (pageOn: number) => {
  pageNationParams.pageOn = pageOn;
  getConsult();
};

const changeSwitch = async (state: any, consult_id: string) => {
  const res: any = await updateConsultState({ state, consult_id });
  if (res.code !== 200) {
    Message.error(res.msg);
    // getConsult();
    return;
  }
  Message.success("状态修改成功");
  getConsult();
};

//提交修改或发布
const validateForm = async (isShow: boolean = true, value: any) => {
  if (!isShow) return (consultModelVisible.value = false);
  if (!useAuth()) return;
  if (value?.consult_id) {
    const res: any = await updateConsult(value);
    if (res.code !== 200) {
      return Message.error(res.msg);
    }
    Message.success(res.msg);
    consultModelVisible.value = false;
  } else {
    const res: any = await publishConsult(
      {...value,manger_id:(useMangerStore().mangerInfo[0] as IMangerData)?.manger_id}
      );
    if (res.code !== 200) {
      return Message.error(res.msg);
    }
    Message.success(res.msg);
    consultModelVisible.value = false;
  }
  getConsult();
};
onMounted(() => {
  getConsult();
});

const itemConsult = ref<IConsultData[]>([]);

const loading = ref(false);
//获取资讯数据
const getConsult = async () => {
  loading.value = true;
  const res: any = await selectConsult({...pageNationParams,
    keyword:keyword.value,
    category:category.value,
  });
  setTimeout(() => {
    if (res.code !== 200)
      return (consultData.value = []), (loading.value = false);
    loading.value = false;
    consultData.value = res.data;
    pageNationParams.total = res.total;
  }, 400);
};

const consultModelOk = () => {
  consultModelVisible.value = false;
  itemConsult.value = [];
};

const consultModelCancel = () => {
  consultModelVisible.value = false;
  itemConsult.value = [];
};

const openModelVisible = (consult_id?: string) => {
  if (consult_id) {
    itemConsult.value = consultData.value?.filter(
      (item) => item.consult_id === consult_id
    );
  } else {
    itemConsult.value = [];
  }
  consultModelVisible.value = true;
};

//点击查看
const selectModel = ref(false);
const selectConsultData = ref<IConsultData[]>([]);
const seeConsult = (consult_id: string) => {
  if (consult_id) {
    selectConsultData.value = consultData.value?.filter(
      (item) => item.consult_id === consult_id
    );
  }
  selectModel.value = true;
  document.documentElement.scrollTop=0
};
//点击删除
const deleteConsult = (consult_id: string) => {
  Modal.warning({
    hideCancel: false,
    title: "温馨提示",
    content: "您确认要永久删除当前资讯信息么？",
    onOk: async () => {
      if (!useAuth()) return;
      const res: any = await delConsult(consult_id);
      if (res.code !== 200) {
        return Message.error(res.msg);
      }
      Message.success(res.msg);
      getConsult();
    },
  });
};
</script>

<style lang="less" scoped>
.consult {
  .table {
    margin-top: 20px;
  }
  .select{
    display: flex;
    .item{
      display: flex;
      align-items: center;
      margin-left: 30px;
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
</style>
