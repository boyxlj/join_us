<template>
  <div class="positionList">
    <div class="select">
      <li class="item">
        <a-cascader
          path-mode
          allow-clear
          allow-search
          v-model:value="form.city"
          :disabled="loading"
          :options="allCityList"
          :field-names="{
            value: 'name',
            label: 'name',
            children: 'subLevelModelList',
          }"
          expand-trigger="hover"
          :style="{ width: '320px' }"
          @change="changeSelect"
          placeholder="请选择城市和区域"
        />
      </li>
      <li class="item">
        <a-cascader
          path-mode
          allow-clear
          allow-search
          v-model:value="form.position_type"
          :disabled="loading"
          :options="positionTypeListCom"
          :field-names="{
            value: 'position_type_id',
            label: 'position_type_name',
            children: 'children',
          }"
          expand-trigger="hover"
          :style="{ width: '320px' }"
          @change="changeSelect"
          placeholder="请选择所属行业"
        />
      </li>

      <li class="item">
        <a-select
          v-model:value="form.job_type"
          allow-clear
          allow-search
          @change="changeSelect"
          :disabled="loading"
          :style="{ width: '320px' }"
          placeholder="请选择职位类型"
        >
          <a-select-option
            v-for="(item, index) in job_typeList"
            :value="item.name"
            :key="index"
            >{{ item.name }}</a-select-option
          >
        </a-select>
      </li>
      <li class="item">
        <a-select
          v-model:value="form.salary"
          allow-clear
          allow-search
          @change="changeSelect"
          :disabled="loading"
          :style="{ width: '320px' }"
          placeholder="请选择薪资范围"
        >
          <a-select-option
            v-for="(item, index) in salaryList"
            :value="item.name"
            :key="index"
            >{{ item.name }}</a-select-option
          >
        </a-select>
      </li>
      <li class="item">
        <a-select
          v-model:value="form.degrees"
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
          v-model:value="form.experiences"
          allow-clear
          allow-search
          @change="changeSelect"
          :disabled="loading"
          :style="{ width: '320px' }"
          placeholder="请选择工作经验"
        >
          <a-select-option
            :value="item.name"
            v-for="(item, index) in experiencesList"
            :key="index"
            >{{ item.name }}</a-select-option
          >
        </a-select>
      </li>
      <li class="item">
        <a-select
          v-model:value="form.position_state"
          allow-clear
          allow-search
          @change="changeSelect"
          :disabled="loading"
          :style="{ width: '320px' }"
          placeholder="请选择职位状态"
        >
          <a-select-option
            :value="item.state"
            v-for="(item, index) in stateList"
            :key="index"
            >{{ item.name }}</a-select-option
          >
        </a-select>
      </li>
      <li class="item">
        <a-radio-group
          class="tagList"
          @change="changeSelect"
          v-model:value="form.tagValue"
          :disabled="loading"
        >
          <a-radio-button value="hr">您发布的数据</a-radio-button>
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
          :style="{ width: '320px' }"
          placeholder="请输入职位名称查询"
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
        <a-button
          type="primary"
          class="clear"
          :disabled="loading"
          @click="editOrAddPosition('publish')"
        >
          <template #icon>
            <PlusSquareOutlined />
          </template>
          <template #default>发布职位</template>
        </a-button>
      </li>
    </div>
    <a-table
      :scroll="{ x: 1500 }"
      :loading="loading"
      :columns="columns"
      :pagination="false"
      :data-source="positionData"
      bordered
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'operation'">
          <a-button
            @click="lookDetail(record.position_id)"
            style="font-size: 14px; margin-bottom: 5px"
            type="primary"
            size="small"
          >
            <template #icon>
              <EyeOutlined />
            </template>
            查看
          </a-button>

          <a-button
            :disabled="record.position_state == '0'"
            @click="
              editOrAddPosition(
                'update',
                record.position_id,
                record.position_state
              )
            "
            style="font-size: 14px; margin: 0 10px"
            type="primary"
            size="small"
          >
            <template #icon>
              <EditOutlined />
            </template>
            编辑
          </a-button>

          <a-button
            @click="delPosition(record.position_id)"
            style="font-size: 14px; margin-bottom: 5px"
            type="danger"
            size="small"
          >
            <template #icon>
              <DeleteOutlined />
            </template>
            删除
          </a-button>
        </template>
        <template v-if="column.dataIndex === 'position_state'">
          <a-tag color="success" v-if="record.position_state === '1'"
            >正常</a-tag
          >
          <a-tag color="warning" v-else-if="record.position_state === '0'"
            >待审核</a-tag
          >
          <a-tag color="error" v-else-if="record.position_state === '2'"
            >已关闭</a-tag
          >
        </template>
        <template v-if="column.dataIndex === 'position_type'">
          <span
            >{{ dealWithData(record.position_type1) }}-{{
              dealWithData(record.position_type2, record.position_type1)
            }}</span
          >
        </template>
        <template v-if="column.dataIndex === 'pos_addTime'">
          <a-tooltip v-if="record.pos_addTime" placement="top">
            <template #title>
              <span>{{ getTime(record.pos_addTime, "time") }}</span>
            </template>
            <span>{{ getTimeBefore(record.pos_addTime) }}</span>
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
        <template v-if="column.dataIndex === 'change_state'">
          <a-switch 
          @change="changeSwitch($event, record.position_id)"
          :disabled="record.position_state=='0'"
          v-model:checked="record.position_state"
          checkedValue="1"
          unCheckedValue="2"
           checked-children="开启" un-checked-children="关闭" />
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
      v-if="positionData.length"
      :disabled="loading"
    />
    <a-modal
      style="width: 900px"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      :key="random"
      v-model:visible="publishOrUpdateVisible"
      :title="positionItem.length ? '编辑职位信息' : '发布职位'"
      @ok="publishOrUpdateHandle"
      @cancel="publishOrUpdateCancel"
      ><PositionForm
        @closePublishOrUpdateModel="closePublishOrUpdateModel"
        :clearData="clearData"
        :positionItem="positionItem"
    /></a-modal>
    <a-modal
      style="width: 900px"
      centered
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      v-model:visible="selectPosItemVisible"
      title="查看职位信息"
      @cancel="selectPosItemCancel"
    >
      <SelectCom :positionItem="positionItem" />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import {
  SearchOutlined,
  ClearOutlined,
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusSquareOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons-vue";
import { createVNode } from "vue";
import {  message, Modal } from "ant-design-vue";
import { getCompanyPositions, hrDelPosition,updatePositionState } from "@/api";
import { useCity } from "@/store/city";
import { useGetConditionData } from "@/store/condition";
import { getTime, getTimeBefore } from "@/utils/formatTime";
import { IPositionData } from "./types";
import { useJobTypeStore } from "@/store/positionType";
import PositionForm from "./components/positionForm/index.vue";
import SelectCom from "./components/selectCom/index.vue";
import { useCompanyState } from "@/hooks/useCompanyState";
import { useHrState } from "@/hooks/useHrState";
import { useCompanyInfo } from "@/store/company_hr";
import { useHrInfo } from "@/store/hr";
const { company_id } = useCompanyInfo();
const { hr_id } = useHrInfo();
const { allCityList } = useCity();
const conditions = useGetConditionData().conditionData;
const job_typeList = conditions[0];
const experiencesList = conditions[1];
const salaryList = conditions[2];
const degreesList = conditions[3];
const { positionTypeList } = useJobTypeStore();
const random = ref(0);
const stateList = [
  { state: "0", name: "待审核" },
  { state: "1", name: "正常" },
  { state: "2", name: "已驳回/已关闭" },
];
const columns = [
  {
    title: "职位名称",
    dataIndex: "position_name",
    width: 200,
  },
  {
    title: "工作城市",
    dataIndex: "cityName",
    width: 200,
  },
  {
    title: "所在区域",
    dataIndex: "pos_region",
    width: 200,
  },
  {
    title: "学历",
    dataIndex: "degrees",
    width: 200,
  },
  {
    title: "工作经验",
    dataIndex: "experiences",
    width: 200,
  },

  {
    title: "职位分类",
    dataIndex: "position_type",
    width: 200,
  },
  {
    title: "薪资",
    dataIndex: "salary",
    width: 200,
  },
  {
    title: "发布人事",
    dataIndex: "name",
    width: 200,
  },
  {
    title: "人事头像",
    dataIndex: "avatar",
    width: 200,
  },
  {
    title: "人事身份",
    dataIndex: "hr_identity",
    width: 200,
  },
  {
    title: "发布时间",
    fixed: "right",
    dataIndex: "pos_addTime",
    width: 110,
  },
  {
    title: "切换状态",
    dataIndex: "change_state",
    fixed: "right",
    width: 90,
  },
  {
    title: "职位状态",
    dataIndex: "position_state",
    fixed: "right",
    width: 90,
  },
  {
    title: "操作",
    fixed: "right",
    width: 250,
    dataIndex: "operation",
  },
];

//切换职位状态
const changeSwitch = async(state: any, position_id: string)=>{
  const res: any = await updatePositionState({ state, position_id });
  if (res.code !== 200) {
    message.error(res.msg);
    return;
  }
  message.success("状态修改成功");
  getPosition();

}
const form = reactive<any>({
  position_type: "",
  city: "",
  experiences: undefined,
  keyword: "",
  position_state: undefined,
  job_type: undefined,
  salary: undefined,
  degrees: undefined,
  tagValue: "hr",
});

//是否重置表单
const clearData = ref(false);

//查看职位信息
const selectPosItemVisible = ref(false);
const selectPosItemCancel = () => {
  positionItem.value = [];
};

//编辑或发布对话框
const publishOrUpdateVisible = ref(false);
const publishOrUpdateHandle = () => {
  clearData.value = true;
};
const publishOrUpdateCancel = () => {
  clearData.value = true;
  positionItem.value = [];
};
//点击查看按钮
const lookDetail = async (position_id: string) => {
  selectPosItemVisible.value = true;
  positionItem.value = positionData.value?.filter(
    (item) => item.position_id === position_id
  );
};
const positionItem = ref<IPositionData[]>([]);

//编辑或发布按钮
const editOrAddPosition = async (
  type: string,
  position_id?: string,
  position_state?: string
) => {
  publishOrUpdateVisible.value = true;
  positionItem.value = [];
  if (type == "publish") {
    random.value = Math.random();
    clearData.value = true;
  } else {
    positionItem.value = positionData.value?.filter(
      (item) => item.position_id === position_id
    );
  }
};

//子组件点击取消关闭modal
const closePublishOrUpdateModel = (flag?: boolean, type?: string) => {
  positionItem.value = [];
  clearData.value = true;
  publishOrUpdateVisible.value = false;
  if (flag) {
    clearData.value = true;
    if (type === "publish") {
      pageNationParams.pageOn = 1;
      getPosition();
    } else {
      getPosition();
    }
  }
};

//切换职位和公司规模/以及搜索、
const changeSelect = () => {
  pageNationParams.pageOn = 1;
  getPosition();
};
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
  getPosition();
};

const loading = ref(false);

interface NObject {
  [key: string]: string | number | undefined | null | void;
}

onMounted(() => {
  getPosition();
});

const positionData = ref<IPositionData[]>([]);
const getPosition = async () => {
  const params: NObject = {
    keyword: form.keyword,
    cityName: form.city.length ? form.city[1] : "",
    pos_region: form.city.length ? form.city[2] : "",
    tagValue: form.tagValue ? form.tagValue : "hr",
    position_state: form.position_state ? form.position_state : "",
    position_type1: form.position_type?.length ? form.position_type[0] : "",
    position_type2: form.position_type?.length ? form.position_type[1] : "",
    degrees: form.degrees == "不限" ? "" : form.degrees,
    salary: form.salary == "不限" ? "" : form.salary,
    job_type: form.job_type == "不限" ? "" : form.job_type,
    experiences: form.experiences == "不限" ? "" : form.experiences,
    hr_id,
    company_id,
    ...pageNationParams,
  };

  for (let i in params) {
    if (params[i] == undefined) {
      params[i] = "";
    }
  }
  loading.value = true;
  const res: any = await getCompanyPositions(params);
  setTimeout(() => {
    if (res.code !== 200)
      return (positionData.value = []), (loading.value = false);
    loading.value = false;
    positionData.value = res.data;
    pageNationParams.total = res.total;
  }, 400);
};

//删除职位
const delPosition = (position_id: string) => {
  Modal.confirm({
    title: "温馨提示",
    okText: "确认删除",
    cancelText: "取消",
    centered: true,
    icon: createVNode(ExclamationCircleOutlined),
    content: createVNode(
      "div",
      { style: "color:red;" },
      "您确定要删除该职位吗?"
    ),
    onOk: async () => {
      if (!(await useCompanyState()).state) return;
      if (!(await useHrState()).state) return;
      hrDelPosition(position_id).then((res: any) => {
        if (res.code === 200) {
          message.success(res.msg);
          getPosition();
        } else {
          message.error(res.msg);
          getPosition();
        }
      });
    },
    onCancel() {},
    class: "test",
  });
};

//重置
const clearSelect = () => {
  form.tagValue = "hr";
  form.position_type = "";
  form.experiences = undefined;
  form.city = "";
  form.keyword = "";
  form.position_state = undefined;
  form.job_type = undefined;
  form.salary = undefined;
  form.degrees = undefined;
  pageNationParams.pageOn = 1;
  getPosition();
};

//处理职位分类数据
const dealWithData = (position_value: string, parent?: string) => {
  if (!parent) {
    const res: any = positionTypeList.filter(
      (item: any) => item.position_type_id == position_value
    );
    return res[0].position_type_name;
  } else {
    const res: any = positionTypeList.filter(
      (item: any) => item.position_type_id == parent
    );
    if (res.length) {
      const res2: any = res[0].children?.filter(
        (item: any) => item.position_type_id == position_value
      );
      return res2[0].type_name;
    } else {
      return "";
    }
  }
};

const positionTypeListCom = computed<any[]>(() => {
  const resultArr: any[] = positionTypeList.map((item: any) => {
    return {
      position_type_name: item.position_type_name,
      position_type_id: item.position_type_id,
      children: [],
    };
  });
  const secondArr: any[] = positionTypeList
    .map((item: any) => item.children)
    .flat(Infinity)
    .map((item: any) => {
      return {
        position_type_id: item.position_type_id,
        position_type_name: item.type_name,
        parent: item.parent,
      };
    });
  secondArr.forEach((item: any) => {
    if (
      resultArr.findIndex(
        (item2: any) => item2.position_type_id === item.parent
      ) !== -1
    ) {
      resultArr[
        resultArr.findIndex(
          (item2: any) => item2.position_type_id === item.parent
        )
      ].children.push(item);
    }
  });
  return resultArr;
});
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
