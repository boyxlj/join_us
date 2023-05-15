<template>
  <div class="consult">
    <!-- <a-button type="primary" @click="openModelVisible()">发布资讯</a-button> -->
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
        <a-table-column title="注册城市" data-index="reg_city"></a-table-column>
      
        
        <a-table-column title="行业" data-index="industry"></a-table-column>
        <a-table-column title="规模" data-index="people_num"></a-table-column>
     
        <a-table-column title="成立时间" data-index="create_time">
          <template #cell="{ record }">
            <a-tooltip :content="getTime(record.create_time)">
              <span>{{ getTimeBefore(record.create_time) }}</span>
            </a-tooltip>
          </template>
        </a-table-column>
        <a-table-column title="状态" data-index="state">
          <template #cell="{ record }">
            <a-tag color="orange" v-if="record.state=='0'">待审核</a-tag>
            <a-tag color="green" v-if="record.state=='1'">当前正常</a-tag>
            <a-tag color="red" v-if="record.state=='2'">已驳回/关闭</a-tag>
          </template>
        </a-table-column>
        <a-table-column title="切换状态">
          <template #cell="{ record }">
            <a-switch
              :disabled="!useAuth(false)"
              @change="changeSwitch($event, record.company_id)"
              v-model="record.state"
              checked-value="1"
              uncheckedValue="2"
            >
              <template #checked> 正常 </template>
              <template #unchecked> 关闭 </template>
            </a-switch>
          </template>
        </a-table-column>
        <a-table-column title="操作" data-index="category">
          <template #cell="{ record }">
            <a-button  :status="btnStyle.select.status" :type="btnStyle.select.type" @click="seeCompany(record.company_id)"
              >查看</a-button
            >
            <!-- <a-button
            :type="btnStyle.editor.type"
              style="margin: 0 10px"
              :status="btnStyle.editor.status"
              @click="openModelVisible(record.company_id)"
              >编辑</a-button
            > -->
            <a-button
            style="margin: 0 10px"
            :type="btnStyle.delete.type"
              :status="btnStyle.delete.status"
              @click="deleteConsult(record.company_id)"
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
      v-model:visible="companyModelVisible"
      @ok="companyModelOk"
      @cancel="consultModelCancel"
    >
      <template #title>{{
        itemCompany.length ? "编辑公司信息" : "注册公司"
      }}</template>
      <!-- <ConsultForm
        :companyModelVisible="companyModelVisible"
        :validateForm="validateForm"
        :itemCompany="itemCompany"
      /> -->
    </a-modal>
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
// import ConsultForm from "./components/consultForm/index.vue";
import SelectCompany from "../components/selectCompany/index.vue";
import {
  publishConsult,
  updateConsult,
  selCompanyAll,
  updateCompanyState,
  delConsult,
} from "@/api";
import { Message, Modal } from "@arco-design/web-vue";
import { getTime, getTimeBefore } from "@/utils/formatTime";
import { useAuth } from "@/hooks/useAuth";
import {  IconUser } from "@arco-design/web-vue/es/icon";
import {btnStyle} from "@/config/btnStyle"
import { ICompanyData } from "@/types/company";
const companyModelVisible = ref(false);
const companyData = ref<ICompanyData[]>([]);
const pageNationParams = reactive({
  pageOn: 1,
  pageSize: 15,
  total: 2,
});
const changePageNation = (pageOn: number) => {
  document.documentElement.scrollTo({
    top:0,
    behavior:"smooth"
  })
  pageNationParams.pageOn = pageOn;
  getCompany();
};

const changeSwitch = async (state: any, company_id: string) => {
  const res: any = await updateCompanyState({ state, company_id });
  if (res.code !== 200) {
    Message.error(res.msg);
    // getCompany();
    return;
  }
  Message.success("状态修改成功");
  getCompany();
};

//提交修改或发布
const validateForm = async (isShow: boolean = true, value: any) => {
  if (!isShow) return (companyModelVisible.value = false);
  if (!useAuth()) return;
  if (value?.company_id) {
    const res: any = await updateConsult(value);
    if (res.code !== 200) {
      return Message.error(res.msg);
    }
    Message.success(res.msg);
    companyModelVisible.value = false;
  } else {
    const res: any = await publishConsult(
      {...value,}
      );
    if (res.code !== 200) {
      return Message.error(res.msg);
    }
    Message.success(res.msg);
    companyModelVisible.value = false;
  }
  getCompany();
};
onMounted(() => {
  getCompany();
});

const itemCompany = ref<ICompanyData[]>([]);

const loading = ref(false);
//获取公司数据
const getCompany = async () => {
  loading.value = true;
  const res: any = await selCompanyAll(pageNationParams);
  setTimeout(() => {
    if (res.code !== 200)
      return (companyData.value = []), (loading.value = false);
    loading.value = false;
    companyData.value = res.data;
    pageNationParams.total = res.total;
  }, 400);
};

const companyModelOk = () => {
  companyModelVisible.value = false;
  itemCompany.value = [];
};

const consultModelCancel = () => {
  companyModelVisible.value = false;
  itemCompany.value = [];
};

const openModelVisible = (company_id?: string) => {
  if (company_id) {
    itemCompany.value = companyData.value?.filter(
      (item) => item.company_id === company_id
    );
  } else {
    itemCompany.value = [];
  }
  companyModelVisible.value = true;
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
//点击删除
const deleteConsult = (company_id: string) => {
  Modal.warning({
    hideCancel: false,
    title: "温馨提示",
    content: "您确认要永久删除当前资讯信息么？",
    onOk: async () => {
      if (!useAuth()) return;
      const res: any = await delConsult(company_id);
      if (res.code !== 200) {
        return Message.error(res.msg);
      }
      Message.success(res.msg);
      getCompany();
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
