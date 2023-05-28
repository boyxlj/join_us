<template>
  <div class="hrs">
    <a-table :loading="loading" :pagination="false" :dataSource="hrData" :columns="columns" >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'hr_state'">
          <a-tag color="success" v-if="record.hr_state === '1'"
            >正常</a-tag
          >
          <a-tag color="error" v-else-if="record.hr_state === '2'"
            >异常</a-tag
          >
        </template>
        <template v-if="column.dataIndex === 'hr_identity'">
          <a-tag color="blue" 
            >{{record.hr_identity || '人事'}}</a-tag
          >
        </template>
        <template v-if="column.dataIndex === 'reg_time'">
          <a-tooltip v-if="record.reg_time" placement="top">
            <template #title>
              <span>{{ getTime(record.reg_time, "time") }}</span>
            </template>
            <span>{{ getTime(record.reg_time) }}</span>
          </a-tooltip>
          <span v-else>/</span>
        </template>
        <template v-if="column.dataIndex === 'avatar'">
          <a-avatar v-if="record.avatar" :src="record.avatar" size="large">
          </a-avatar>
          <a-avatar v-else size="large">
            <template #icon><UserOutlined /></template>
          </a-avatar>
        </template>
        <template v-if="column.dataIndex === 'name'">
          <span >{{ record.name || '/' }}</span>
        </template>
      </template>
    </a-table>
    <a-pagination
      @change="changePageNation"
      style="margin-top: 20px;"
      :pageSize="pageNationParams.pageSize"
      v-model:current="pageNationParams.pageOn"
      :total="pageNationParams.total"
      show-less-items
      class="pageNation"
      v-if="hrData.length"
      :disabled="loading"
    />
  </div>
</template>

<script setup lang="ts">
import { UserOutlined } from "@ant-design/icons-vue";
import { selectCompanyHrs } from "@/api";
import { useCompanyInfo } from "@/store/company_hr";
import { IHrData } from "@/types/hr";
import { getTime } from "@/utils/formatTime";
const { company_id } = useCompanyInfo();
const columns = [
  {
    title: "头像",
    dataIndex: "avatar",
    key: "avatar",
  },
  {
    title: "昵称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "身份",
    dataIndex: "hr_identity",
    key: "hr_identity",
  },
  {
    title: "联系方式",
    dataIndex: "telephone",
    key: "telephone",
  },
  {
    title: "账号状态",
    dataIndex: "hr_state",
    key: "hr_state",
  },
  {
    title: "加入时间",
    dataIndex: "reg_time",
    key: "reg_time",
  },
];
//分页相关
const pageNationParams = reactive({
  pageOn: 1,
  pageSize: 15,
  total: 2,
});
//切换分页
const changePageNation = (pageOn: number) => {
  document.documentElement.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  pageNationParams.pageOn = pageOn;
  getHrs();
};
const hrData = ref<IHrData[]>([]);
const loading = ref(false);
onMounted(() => {
  getHrs();
});
const getHrs = async () => {
  loading.value= true
  const params = { ...pageNationParams, company_id };
  const res: any = await selectCompanyHrs(params);
  setTimeout(() => {
    if (res.code !== 200) return (hrData.value = []), (loading.value = false);
    loading.value = false;
    hrData.value = res.data;
    pageNationParams.total = res.total;
  }, 400);
};
</script>

<style lang="less" scoped></style>
