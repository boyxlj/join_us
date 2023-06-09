<template>
  <div class="manger">
    <a-button type="primary" @click="openModelVisible()">添加管理员</a-button>
    <a-table
      class="table"
      @page-change="changePageNation"
      :pagination="pageNationParams"
      :data="mangerData"
      :loading="loading"
    >
      <template #columns>
        <a-table-column title="头像" data-index="avatar">
          <template #cell="{ record }">
            <a-avatar v-if="record.avatar" :imageUrl="record.avatar"></a-avatar>
            <a-avatar v-else>
              <IconUser />
            </a-avatar>
          </template>
        </a-table-column>
        <a-table-column title="昵称" data-index="name"></a-table-column>
        <a-table-column title="账号" data-index="username"></a-table-column>
        <a-table-column title="角色" data-index="manger_state">
          <template #cell="{ record }">
            <a-tooltip content="超级管理员可拥有操作的所有权限">
              <a-tag color="green" v-if="record.manger_state == '1'">超级管理员</a-tag>
            </a-tooltip>
            <a-tooltip content="普通管理员目前仅可以查看部分功能">
              <a-tag color="orange" v-if="record.manger_state == '0'"
                >普通管理员</a-tag
              >
            </a-tooltip>
          </template>
        </a-table-column>
        <a-table-column title="权限">
          <template #cell="{ record }">
            <a-switch
              @change="changeSwitch($event, record.manger_id)"
              v-model="record.manger_state"
              checked-value="1"
              uncheckedValue="0"
              :disabled="!useAuth(false)"
            >
              <template #checked> 开 </template>
              <template #unchecked> 关 </template>
            </a-switch>
          </template>
        </a-table-column>
        <a-table-column title="添加时间" data-index="regTime">
          <template #cell="{ record }">
            <a-tooltip :content="getTime(record.regTime, 'time')">
              <span>{{ getTimeBefore(record.regTime) }}</span>
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
              @click="openModelVisible(record.manger_id)"
              >编辑</a-button
            >
            <a-button
            :type="btnStyle.delete.type"
              :status="btnStyle.delete.status"
              :size="btnStyle.select.size"
              @click="deleteManger(record.manger_id)"
              >删除</a-button
            >
          </template>
        </a-table-column>
      </template>
    </a-table>
    <!-- 添加、编辑管理员对话框 -->
    <a-modal
      :footer="false"
      :width="580"
      :mask-closable="false"
      v-model:visible="mangerModelVisible"
      @ok="mangerModelOk"
      @cancel="mangerModelCancel"
    >
      <template #title>{{
        itemManger.length ? "编辑管理员" : "添加管理员"
      }}</template>
      <MangerForm
        :mangerModelVisible="mangerModelVisible"
        :validateForm="validateForm"
        :itemManger="itemManger"
      />
    </a-modal>
   
  </div>
</template>

<script setup lang="ts">
import { IconUser } from "@arco-design/web-vue/es/icon";
import { selMangerAll } from "@/api";
import MangerForm from "./components/mangerForm/index.vue";
import {
  regManger,
  updateManger,
  delManger,
  updateMangerState,
} from "@/api";
import { Message, Modal } from "@arco-design/web-vue";
import { getTime, getTimeBefore } from "@/utils/formatTime";
import { IMangerData } from "@/types/manger";
import { useAuth } from "@/hooks/useAuth";
import {btnStyle} from "@/config/btnStyle"
import {useMangerStore} from "@/store/manger"
const {manger_state}= useMangerStore().mangerInfo[0]
const router = useRouter()


const mangerModelVisible = ref(false);
const mangerData = ref<IMangerData[]>([]);
const pageNationParams = reactive({
  pageOn: 1,
  pageSize: 15,
  total: 2,
});
const changePageNation = (pageOn: number) => {
  pageNationParams.pageOn = pageOn;
  getManger();
};
onMounted(() => {
  getManger();
  if(manger_state!='1'){
    return router.replace("/notfound")
  }
});

const changeSwitch = async (state: any, manger_id: string) => {
  const res: any = await updateMangerState({ state, manger_id });
  if (res.code !== 200) {
    Message.error(res.msg);
    getManger();
    return;
  }
  Message.success("权限修改成功");
  if(manger_id===useMangerStore().manger_id){
    useMangerStore().getManger()
  }
  getManger();
};

//提交添加或修改
const validateForm = async (isShow: boolean = true, value: any) => {
  if (!isShow) return (mangerModelVisible.value = false);
  if (!useAuth()) return;
  if (value?.manger_id) {
    const res: any = await updateManger(value);
    if (res.code !== 200) {
      return Message.error(res.msg);
    }
    if(value.manger_id===useMangerStore().manger_id){
      useMangerStore().getManger()
    }
    Message.success(res.msg);
    mangerModelVisible.value = false;
  } else {
    const res: any = await regManger(value);
    if (res.code !== 200) {
      return Message.error(res.msg);
    }
    Message.success(res.msg);
    mangerModelVisible.value = false;
  }
  
  getManger();
};

const itemManger = ref<IMangerData[]>([]);

const loading = ref(false);
//获取资讯数据
const getManger = async () => {
  loading.value = true;
  const res: any = await selMangerAll(pageNationParams);
  setTimeout(() => {
    if (res.code !== 200)
      return (mangerData.value = []), (loading.value = false);
    loading.value = false;
    mangerData.value = res.data;
    pageNationParams.total = res.total;
  }, 400);
};

const mangerModelOk = () => {
  mangerModelVisible.value = false;
  itemManger.value = [];
};

const mangerModelCancel = () => {
  mangerModelVisible.value = false;
  itemManger.value = [];
};

const openModelVisible = (manger_id?: string) => {
  mangerModelVisible.value = true;
  if (manger_id) {
    itemManger.value = mangerData.value?.filter(
      (item) => item.manger_id === manger_id
    );
  }else{
    itemManger.value =[]
  }
};


//点击删除
const deleteManger = (manger_id: string) => {
  Modal.warning({
    hideCancel: false,
    title: "温馨提示",
    content: "您确认要永久删除该管理员吗？此操作将同步删除由当前管理员所发布的一切内容，如：资讯、轮播、行业、职位类型等等",
    onOk: async () => {
      if (!useAuth()) return;
      const res: any = await delManger(manger_id);
      if (res.code !== 200) {
        return Message.error(res.msg);
      }
      Message.success(res.msg);
      getManger();
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
</style>
