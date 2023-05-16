<template>
  <div class="manger">
    <div class="select">
      <a-button type="primary" @click="openModelVisible()">添加职位类型-2</a-button>
      <div class="search">
        <a-select style="margin-right: 10px;" v-model="parent" allow-clear  allow-search @change="changeSelect" :disabled="loading" :style="{width:'320px'}" placeholder="请选择职位一级分类">
      <a-option :value="item.position_type_id" v-for="(item,index) in positionCategory1List" :key="index">{{ item.type_name }}</a-option>
    </a-select>
        <a-input-search  
      @clear="changeSelect" @search="changeSelect"  
      @press-enter="changeSelect" 
      allow-clear  
      allow-search 
      v-model.trim="keyword" :disabled="loading "  :style="{width:'320px'}" placeholder="请输入职位类型名称等关键字" search-button>
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
      </div>
    </div>
    <a-table
      class="table"
      @page-change="changePageNation"
      :pagination="pageNationParams"
      :data="positionTypeData"
      :loading="loading"
    >
      <template #columns>
        <a-table-column title="职位二级分类名称" data-index="type_name">
          <template #cell="{ record }">
          <a-tooltip :content="record.type_name">
            <span class="tableTitle">{{ record.type_name }}</span>
          </a-tooltip>
        </template>
        </a-table-column>
        <a-table-column title="添加人昵称" data-index="name">
          <template #cell="{ record }">
          <a-popover position="top">
            <span>{{ record.name }}</span>
            <template #content>
              <div class="mangerInfo">
                <div class="avatar">
                  <a-avatar v-if="record.avatar" :imageUrl="record.avatar"></a-avatar>
                  <a-avatar v-else>
                    <IconUser />
                  </a-avatar>
                </div>
                <div class="info">{{ record.name }}</div>
                <div class="timer">注册于：{{ getTime(record.regTime) }}</div>
              </div>
            </template>
          </a-popover>
        </template>
        </a-table-column>
        <a-table-column title="一级分类" data-index="others">
          <template #cell="{ record }">
            
            <a-tooltip  :content="getCategoryName(record.parent)">
              <a-tag color="blue" class="tableTitle" style="max-width: 280px;">{{ getCategoryName(record.parent) }}</a-tag>
            </a-tooltip>
        </template>
        </a-table-column>
        <a-table-column title="备注" data-index="others">
          <template #cell="{ record }">
          <a-tooltip v-if="record.others" :content="record.others">
            <span class="tableTitle" style="max-width: 280px;">
              {{ record.others }}
            </span>
          </a-tooltip>
          <span v-else class="tableTitle" style="max-width: 280px;">/</span>
        </template>
        </a-table-column>
        <a-table-column title="添加时间" data-index="addTime">
          <template #cell="{ record }">
            <a-tooltip :content="getTime(record.addTime, 'time')">
              <span>{{ getTimeBefore(record.addTime) }}</span>
            </a-tooltip>
          </template>
        </a-table-column>
        <a-table-column title="操作" data-index="category">
          <template #cell="{ record }">
           
            <a-button
              style="margin: 0 10px"
              :type="btnStyle.editor.type"
              :status="btnStyle.editor.status"
              :size="btnStyle.select.size"
              @click="openModelVisible(record.position_type_id)"
              >编辑</a-button
            >
            <a-button
            :type="btnStyle.delete.type"
              :status="btnStyle.delete.status"
              :size="btnStyle.select.size"
              @click="deleteIndustry(record.position_type_id)"
              >删除</a-button
            >
          </template>
        </a-table-column>
      </template>
    </a-table>
    <!-- 添加、编辑职位类型对话框 -->
    <a-modal
      :footer="false"
      :width="580"
      :mask-closable="false"
      v-model:visible="category1ModelVisible"
      @ok="industryModelOk"
      @cancel="industryModelCancel"
    >
      <template #title>{{
        itemCategory1.length ? "编辑职位类型-2" : "添加职位类型-2"
      }}</template>
      <Category2Form
        :category1ModelVisible="category1ModelVisible"
        :validateForm="validateForm"
        :itemCategory1="itemCategory1"
      />
    </a-modal>
   
  </div>
</template>

<script setup lang="ts">
import {  IconUser,IconSearch,IconRefresh } from "@arco-design/web-vue/es/icon";
import Category2Form from "./components/category2Form/index.vue";
import {
  addPositionType,
  selPositionTypeAll,
  updatePositionType,
  delPositionType,
} from "@/api";
import { Message, Modal } from "@arco-design/web-vue";
import { getTime, getTimeBefore } from "@/utils/formatTime";
import { IPositionTypeData } from "@/types/positionType";
import { useAuth } from "@/hooks/useAuth";
import {btnStyle} from "@/config/btnStyle"
import {useMangerStore} from "@/store/manger"
import {usePositionTypeStore} from "@/store/positionType"
import {IPositionCategoryTypeData} from "@/types/positionType"
const positionCategory1List:IPositionCategoryTypeData[]  = usePositionTypeStore().positionCategory1List    
const manger_id = useMangerStore().manger_id
const category1ModelVisible = ref(false);
const positionTypeData = ref<IPositionTypeData[]>([]);
const pageNationParams = reactive({
  pageOn: 1,
  pageSize: 15,
  total: 2,
});
const keyword = ref('')
const parent = ref('')  //select 父级id
const changeSelect = ()=>{
  pageNationParams.pageOn =1
  getCategory1();
}
const clearSelect = ()=>{
  keyword.value= ''
  parent.value= ''
  pageNationParams.pageOn =1
  getCategory1();
}
const changePageNation = (pageOn: number) => {
  pageNationParams.pageOn = pageOn;
  getCategory1();
};
onMounted(() => {
  getCategory1();
});

//获取一级分类名称
const getCategoryName = (position_type_id:string)=>{
  if(!position_type_id) return '/'
  const res:IPositionCategoryTypeData[] = positionCategory1List.filter(item=>item.position_type_id==position_type_id)
  if(!res.length) return '/'
  return res[0].type_name
}
 
//提交添加或修改
const validateForm = async (isShow: boolean = true, value: any) => {
  if (!isShow) return (category1ModelVisible.value = false);
  if (!useAuth()) return;
  if (value?.position_type_id) {
    const res: any = await updatePositionType({...value,manger_id});
    if (res.code !== 200) {
      return Message.error(res.msg);
    }
    Message.success(res.msg);
    category1ModelVisible.value = false;
  } else {
    const res: any = await addPositionType({...value,manger_id});
    if (res.code !== 200) {
      return Message.error(res.msg);
    }
    Message.success(res.msg);
    category1ModelVisible.value = false;
  }
  
  getCategory1();
};

const itemCategory1 = ref<IPositionTypeData[]>([]);

const loading = ref(false);
//获取二级职位类型数据
const getCategory1 = async () => {
  loading.value = true;
  const params = {...pageNationParams,keyword:keyword.value,type:'category2',parent:parent.value}
  const res: any = await selPositionTypeAll(params);
  setTimeout(() => {
    if (res.code !== 200)
      return (positionTypeData.value = []), (loading.value = false);
    loading.value = false;
    positionTypeData.value = res.data;
    pageNationParams.total = res.total;
  }, 400);
};

const industryModelOk = () => {
  category1ModelVisible.value = false;
  itemCategory1.value = [];
};

const industryModelCancel = () => {
  category1ModelVisible.value = false;
  itemCategory1.value = [];
};

const openModelVisible = (position_type_id?: string) => {
  category1ModelVisible.value = true;
  if (position_type_id) {
    itemCategory1.value = positionTypeData.value?.filter(
      (item) => item.position_type_id === position_type_id
    );
  }else{
    itemCategory1.value =[]
  }
};


//点击删除
const deleteIndustry = (position_type_id: string) => {
  Modal.warning({
    hideCancel: false,
    title: "温馨提示",
    content: "您确认要永久删除该职位名称吗？",
    onOk: async () => {
      if (!useAuth()) return;
      const res: any = await delPositionType({position_type_id,type:'category2'});
      if (res.code !== 200) {
        return Message.error(res.msg);
      }
      Message.success(res.msg);
      getCategory1();
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
    .search{
      margin-left: 28px;
    }
    .clear{
      margin-left: 10px;
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
