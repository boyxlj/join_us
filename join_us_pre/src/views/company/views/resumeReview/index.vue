<template>
    <div>
      <div class="select">
        <li class="item">
        <a-select
          v-model:value="form.degree"
          allow-clear
          allow-search
          @change="changeSelect"
          :disabled="loading"
          :style="{ width: '320px' }"
          placeholder="请选择学历要求"
        >
          <a-select-option
            v-for="(item, index) in degreesList"
            :value="item.name"
            :key="index"
            >{{ item.name }}</a-select-option
          >
        </a-select>
      </li>
        <li class="item">
        <a-select
          v-model:value="form.apply_state"
          allow-clear
          allow-search
          @change="changeSelect"
          :disabled="loading"
          :style="{ width: '320px' }"
          placeholder="请选择求职状态"
        >
          <a-select-option
            v-for="(item, index) in hopeState"
            :value="item.name"
            :key="index"
            >{{ item.name }}</a-select-option
          >
        </a-select>
      </li>
      <li class="item">
        <a-select
          v-model:value="form.types"
          allow-clear
          allow-search
          @change="changeSelect"
          :disabled="loading"
          :style="{ width: '320px' }"
          placeholder="请选择投递状态"
        >
          <a-select-option
            :value="item.state"
            v-for="(item, index) in stateList"
            :key="index"
            >{{ item.name }}</a-select-option
          >
        </a-select>
      </li>
      <br>
      <li class="item">
        <a-radio-group
          class="tagList"
          @change="changeSelect"
          v-model:value="form.tagValue"
          :disabled="loading"
        >
          <a-radio-button value="hr">您收到的数据</a-radio-button>
          <a-radio-button value="company">公司的所有数据</a-radio-button>
        </a-radio-group>
      </li>
      <li class="item">
        <a-input-search
          @clear="changeSelect"
          @search="changeSelect"
          @press-enter="changeSelect"
          allow-clear
          allow-search
          v-model:value.trim="form.keyword"
          :disabled="loading"
          :style="{ width: '340px' }"
          placeholder="请输入职位名称用户姓名查询"
          search-button
        >
          <template #button-icon>
            <SearchOutlined />
          </template>
          <template #button-default> 查询 </template>
        </a-input-search>
        <a-button   :disabled="loading" class="clear" @click="clearSelect">
          <template #icon>
            <ClearOutlined />
          </template>
          <template #default>重置</template>
        </a-button>
      </li>
      </div>
        <a-table  :loading="loading" 
        :scroll="{ x: 1700 }" 
        :pagination="false" 
        :data-source="deliveryRecordList" 
        :columns="columns" bordered>
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'avatar'">
                  <a-avatar v-if="record.avatar" :src="record.avatar" size="large">
                </a-avatar>
                <a-avatar v-else size="large">
                  <template #icon><UserOutlined /></template>
                </a-avatar>
                </template>
                <template v-if="column.key === 'sendTime'">
                  <a-tooltip>
                    <template #title>{{ getTime(record.sendTime,'time') }}</template>
                  <span>{{ getTimeBefore(record.sendTime) }}</span>
                  </a-tooltip>
                </template>
                <template v-if="column.key === 'position_state'">
                    <a-tag v-show="record.position_state === '1'" color="success">正常</a-tag>
                    <a-tag v-show="record.position_state === '0'" color="warning">待审核</a-tag>
                    <a-tag v-show="record.position_state === '2'" color="error">已关闭</a-tag>
                </template>
                <template v-if="column.key === 'types'">
                    <a-tag v-show="record.types === '1'" color="success">约面试</a-tag>
                    <a-tag v-show="record.types === '0'" color="warning">待回复</a-tag>
                    <a-tag v-show="record.types === '2'" color="error">不合适</a-tag>
                </template>
                <template v-if="column.key === 'oprate'" >
                    <a-button size="small" style="margin: 0 5px;" type="primary" @click="openModal(record.userId)">查看简历</a-button>
                    <a-button size="small" :disabled="record.types === '1' || record.position_state!=='1'" style="margin: 0 5px;" type="primary"
                        @click="updateState(record.sendId, 'interview')">约面试</a-button>
                    <a-button  size="small" :disabled="record.types === '2' || record.position_state!=='1'" style="margin: 0 5px; "  type="danger"
                        @click="updateState(record.sendId, 'inappropriate')">不合适</a-button>
                </template>
            </template>
        </a-table>
        <a-pagination
      @change="changePageNation"
      :pageSize="pageNationParams.pageSize"
      v-model:current="pageNationParams.pageOn"
      :total="pageNationParams.total"
      show-less-items
      class="pageNation"
      v-if="deliveryRecordList.length"
      :disabled="loading"
    />
    </div>
    <a-modal centered width="1000px" v-model:visible="visible" title="在线简历" ok-text="确认" @ok="visible = false">
        <template #footer>
            <a-button key="submit" type="primary" @click="visible = false">确认</a-button>
        </template>
        <onlineResume :userId="userIdVar" />
    </a-modal>
</template>

<script setup lang="ts">
import {SearchOutlined,ClearOutlined,UserOutlined} from "@ant-design/icons-vue";
import { deliveryRecord, updateDeliveryState } from '@/api'
import { message } from 'ant-design-vue'
import {getTime,getTimeBefore} from "@/utils/formatTime"
import onlineResume from '@/components/common/onlineResume/index.vue'
import { useCompanyState } from "@/hooks/useCompanyState";
import { useHrState } from "@/hooks/useHrState";
import { useGetConditionData } from "@/store/condition";
import { useCompanyInfo } from "@/store/company_hr";
import { useHrInfo } from "@/store/hr";
const { company_id } = useCompanyInfo();
const { hr_id } = useHrInfo();
const conditions = useGetConditionData().conditionData;
const degreesList = conditions[3];
interface deliveryRecordType {
    userId: string,
    advantage: string,
    age: number,
    apply_state: string,
    avatar: string,
    born: string,
    degree: string,
    email: string,
    enter_schoolTime: string,
    gender: string,
    hope_city: string,
    hope_job: string,
    hope_job_type: string,
    hope_salary: string,
    leave_schoolTime: string,
    major: string,
    name: string,
    phone: string,
    position_name: string,
    school: string,
    school_exp: string,
    school_type: string
}

//搜索表单
const form = reactive<any>({
  keyword: "",
  apply_state: undefined,
  types: undefined,
  degree: undefined,
  tagValue: "hr",
});

const stateList = [
  { state: "0", name: "待回复" },
  { state: "1", name: "约面试" },
  { state: "2", name: "不合适" },
];
const hopeState = [
  { state: "在职", name: "在职" },
  { state: "离职", name: "离职" },
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
  getDeliveryRecord();
};

const loading = ref(false);
//切换职位和公司规模/以及搜索、
const changeSelect = () => {
  pageNationParams.pageOn = 1;
  getDeliveryRecord();
};

//重置
const clearSelect = () => {
  form.tagValue = "hr";
  form.keyword= ""
  form.apply_state= undefined
  form.types= undefined
  form.degree= undefined
  pageNationParams.pageOn = 1;
  getDeliveryRecord();
};
const propertyMap: Record<string, string> = {
  avatar: '头像',
  name: '姓名',
    position_name: '投递职位名称',
    degree: '学历',
    phone: '手机号',
    email: '邮箱',
    school: '学校',
    leave_schoolTime: '毕业时间',
    sendTime: '投递时间',
    position_state: '职位状态',
    types: '投递状态',
    oprate: '操作'
}
const columns = ref<any[]>([])
const deliveryRecordList = ref<Array<deliveryRecordType>>([])
let visible = ref(false)
let userIdVar = ref('')
const getDeliveryRecord = () => {
  loading.value= true
    deliveryRecord(
      {
        ...pageNationParams,
          company_id, 
          hr_id, 
          ...form
      }

    ).then((res: any) => {
      setTimeout(() => {
        loading.value= false
        if (res.code === 200) {
            deliveryRecordList.value = res.data
            pageNationParams.total = res.total
            columns.value = Object.keys(propertyMap).map((item) => {
              if(item=='oprate'){
                return {
                    title: propertyMap[item],
                    dataIndex: item,
                    key: item,
                    align: 'center',
                    fixed: 'right' ,
                    width:250
                }
              }else if(item=='types'){
                return {
                    title: propertyMap[item],
                    dataIndex: item,
                    key: item,
                    align: 'center',
                    fixed: 'right' ,
                    width:90
                }
              }else if(item=='position_state'){
                return {
                    title: propertyMap[item],
                    dataIndex: item,
                    key: item,
                    align: 'center',
                    fixed: 'right' ,
                    width:90
                }
              }
              else{
                return {
                    title: propertyMap[item],
                    dataIndex: item,
                    key: item,
                    align: 'center',
                    width:160
                }
              }
               
            })
        } else {
            message.error('数据查询失败!')
        }
  }, 400);

    })
}
getDeliveryRecord()
const updateState =async (sendId: string, type: string) => {
  if (!(await useCompanyState()).state) return;
  if (!(await useHrState()).state) return;
    updateDeliveryState(sendId, type).then((res: any) => {
        if (res.code === 200) {
            message.success('状态更新成功！')
        } else {
            message.error('状态更新失败！')
        }
        getDeliveryRecord()
    })
}



const openModal = (userId: string) => {
    visible.value = true
    userIdVar.value = userId
}
</script>

<style lang="less" scoped>

.select {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 18px;
  .item {
    margin-right: 50px;
    margin-top: 15px;

    .clear {
      margin-left: 14px;
    }
  }
}
.pageNation {
  margin-top: 20px;
}

.ant-radio-button-wrapper {
  &:first-child {
    border-radius: 5px 0 0 5px;
  }
  &:last-child {
    border-radius: 0 5px 5px 0;
  }
}
::v-deep(.ant-input-affix-wrapper) {
  border-radius: 5px 0 0 5px !important;
}


</style>