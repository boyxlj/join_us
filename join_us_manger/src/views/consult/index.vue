<template>
  <div class="consult">
    <a-button type="primary" @click="openModelVisible()">发布资讯</a-button>
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
              :disabled="!isAuth"
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
            <a-button type="primary" @click="seeConsult(record.consult_id)"
              >查看</a-button
            >
            <a-button
              type="primary"
              style="margin: 0 10px"
              status="warning"
              @click="openModelVisible(record.consult_id)"
              >编辑</a-button
            >
            <a-button
              type="primary"
              status="danger"
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
import {  IconUser } from "@arco-design/web-vue/es/icon";
const isAuth = useAuth();
const consultModelVisible = ref(false);
const consultData = ref<IConsultData[]>([]);
const pageNationParams = reactive({
  pageOn: 1,
  pageSize: 15,
  total: 2,
});
const changePageNation = (pageOn: number) => {
  pageNationParams.pageOn = pageOn;
  getConsult();
};

const changeSwitch = async (state: any, consult_id: string) => {
  const res: any = await updateConsultState({ state, consult_id });
  console.log(res)
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
  if (!isAuth) return;
  if (!isShow) return (consultModelVisible.value = false);
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
  const res: any = await selectConsult(pageNationParams);
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
      if (!isAuth) return;
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
}
.tableTitle {
  display: inline-block;
  max-width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
