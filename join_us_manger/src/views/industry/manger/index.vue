<template>
  <div class="manger">
    <a-button type="primary" @click="openModelVisible()">添加行业</a-button>
    <a-table
      class="table"
      @page-change="changePageNation"
      :pagination="pageNationParams"
      :data="industryData"
      :loading="loading"
    >
      <template #columns>
        <a-table-column title="行业名称" data-index="industry_name">
          <template #cell="{ record }">
          <a-tooltip :content="record.industry_name">
            <span class="tableTitle">{{ record.industry_name }}</span>
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
        <a-table-column title="备注" data-index="industry_other">
          <template #cell="{ record }">
          <a-tooltip v-if="record.industry_other" :content="record.industry_other">
            <span class="tableTitle" style="max-width: 280px;">
              {{ record.industry_other }}
            </span>

          </a-tooltip>
          <span v-else class="tableTitle" style="max-width: 280px;">/</span>
        </template>
        </a-table-column>
        <a-table-column title="行业状态">
          <template #cell="{ record }">
            <a-switch
              @change="changeSwitch($event, record.industry_id)"
              v-model="record.industry_state"
              checked-value="1"
              uncheckedValue="0"
              :disabled="!useAuth(false)"
            >
              <template #checked> 开启 </template>
              <template #unchecked> 关闭 </template>
            </a-switch>
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
              @click="openModelVisible(record.industry_id)"
              >编辑</a-button
            >
            <a-button
            :type="btnStyle.delete.type"
              :status="btnStyle.delete.status"
              @click="deleteIndustry(record.industry_id)"
              >删除</a-button
            >
          </template>
        </a-table-column>
      </template>
    </a-table>
    <!-- 添加、编辑行业对话框 -->
    <a-modal
      :footer="false"
      :width="580"
      :mask-closable="false"
      v-model:visible="industryModelVisible"
      @ok="industryModelOk"
      @cancel="industryModelCancel"
    >
      <template #title>{{
        itemIndustry.length ? "编辑行业" : "添加行业"
      }}</template>
      <IndustryForm
        :industryModelVisible="industryModelVisible"
        :validateForm="validateForm"
        :itemIndustry="itemIndustry"
      />
    </a-modal>
   
  </div>
</template>

<script setup lang="ts">
import { IconUser } from "@arco-design/web-vue/es/icon";
import IndustryForm from "./components/industryForm/index.vue";
import {
  addIndustry,
  selIndustryAll,
  updateIndustry,
  delIndustry,
  updateIndustryState,
} from "@/api";
import { Message, Modal } from "@arco-design/web-vue";
import { getTime, getTimeBefore } from "@/utils/formatTime";
import { IIndustryData } from "@/types/industry";
import { useAuth } from "@/hooks/useAuth";
import {btnStyle} from "@/config/btnStyle"
import {useMangerStore} from "@/store/manger"
const manger_id = useMangerStore().manger_id
const industryModelVisible = ref(false);
const industryData = ref<IIndustryData[]>([]);
const pageNationParams = reactive({
  pageOn: 1,
  pageSize: 15,
  total: 2,
});
const changePageNation = (pageOn: number) => {
  pageNationParams.pageOn = pageOn;
  getIndustry();
};
onMounted(() => {
  getIndustry();
});

const changeSwitch = async (state: any, industry_id: string) => {
  const res: any = await updateIndustryState({ state, industry_id });
  if (res.code !== 200) {
    Message.error(res.msg);
    getIndustry();
    return;
  }
  Message.success("行业状态修改成功");
  getIndustry();
};

//提交添加或修改
const validateForm = async (isShow: boolean = true, value: any) => {
  if (!isShow) return (industryModelVisible.value = false);
  if (!useAuth()) return;

  if (value?.industry_id) {
    const res: any = await updateIndustry(value);
    if (res.code !== 200) {
      return Message.error(res.msg);
    }
    Message.success(res.msg);
    industryModelVisible.value = false;
  } else {
    const res: any = await addIndustry({...value,manger_id});
    if (res.code !== 200) {
      return Message.error(res.msg);
    }
    Message.success(res.msg);
    industryModelVisible.value = false;
  }
  
  getIndustry();
};

const itemIndustry = ref<IIndustryData[]>([]);

const loading = ref(false);
//获取资讯数据
const getIndustry = async () => {
  loading.value = true;
  const res: any = await selIndustryAll(pageNationParams);
  setTimeout(() => {
    if (res.code !== 200)
      return (industryData.value = []), (loading.value = false);
    loading.value = false;
    industryData.value = res.data;
    pageNationParams.total = res.total;
  }, 400);
};

const industryModelOk = () => {
  industryModelVisible.value = false;
  itemIndustry.value = [];
};

const industryModelCancel = () => {
  industryModelVisible.value = false;
  itemIndustry.value = [];
};

const openModelVisible = (industry_id?: string) => {
  industryModelVisible.value = true;
  if (industry_id) {
    itemIndustry.value = industryData.value?.filter(
      (item) => item.industry_id === industry_id
    );
  }else{
    itemIndustry.value =[]
  }
};


//点击删除
const deleteIndustry = (industry_id: string) => {
  Modal.warning({
    hideCancel: false,
    title: "温馨提示",
    content: "您确认要永久删除该管理员吗？",
    onOk: async () => {
      if (!useAuth()) return;
      const res: any = await delIndustry(industry_id);
      if (res.code !== 200) {
        return Message.error(res.msg);
      }
      Message.success(res.msg);
      getIndustry();
    },
  });
};
</script>

<style lang="less" scoped>
.manger {
  .table {
    margin-top: 20px;
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
