<template>
  <div class="manger">
    <!-- <a-button type="primary" @click="openModelVisible()">添加行业</a-button> -->
    <a-table
      class="table"
      @page-change="changePageNation"
      :pagination="pageNationParams"
      :data="userInfoData"
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
        <a-table-column title="姓名(昵称)" data-index="name">
          <template #cell="{ record }">
            <span>{{ record.name?record.name:'/' }}</span>
        </template>
        </a-table-column>
        <a-table-column title="邮箱" data-index="email">
          <template #cell="{ record }">
            <span>{{ record.email?record.email:'/' }}</span>
        </template>
        </a-table-column>
        <a-table-column title="性别" data-index="gender">
          <template #cell="{ record }">
            <a-tag color="blue" v-if="record.gender=='0'">男</a-tag>
            <a-tag color="red" v-else>女</a-tag>
        </template>
        </a-table-column>
        <a-table-column title="学历" data-index="degree">
          <template #cell="{ record }">
            <span>{{ record.degree?record.degree:'/' }}</span>
        </template>
        </a-table-column>
     
        <a-table-column title="期望城市" data-index="hope_city">
          <template #cell="{ record }">
            <span>{{ record.hope_city?record.hope_city:'/' }}</span>
        </template>
        </a-table-column>
        <a-table-column title="期望行业" data-index="hope_industry">
          <template #cell="{ record }">
            <span>{{ record.hope_industry?record.hope_industry:'/' }}</span>
        </template>
        </a-table-column>
        <a-table-column title="出生日期" data-index="born">
          <template #cell="{ record }">
            <span>{{ record.born?record.born:'/' }}</span>
        </template>
        </a-table-column>
       
        <a-table-column title="账号状态">
          <template #cell="{ record }">
            <a-switch
              @change="changeSwitch($event, record.userId)"
              v-model="record.userState"
              checked-value="1"
              uncheckedValue="0"
              :disabled="!useAuth(false)"
            >
              <template #checked> 正常 </template>
              <template #unchecked> 异常 </template>
            </a-switch>
          </template>
        </a-table-column>
        <a-table-column title="注册时间" data-index="reg_time">
          <template #cell="{ record }">
            <a-tooltip :content="getTime(record.reg_time, 'time')">
              <span>{{ getTimeBefore(record.reg_time) }}</span>
            </a-tooltip>
          </template>
        </a-table-column>
        <a-table-column title="操作" data-index="category">
          <template #cell="{ record }">
           
            <a-button
            :size="btnStyle.select.size"
              style="margin: 0 4px"
              :type="btnStyle.select.type"
              :status="btnStyle.select.status"
              @click="openResumeModelVisible(record.userId)"
              >TA的简历</a-button
            >
            <a-button
            :size="btnStyle.select.size"
            style="margin: 0 4px"
              :type="btnStyle.editor.type"
              :status="btnStyle.editor.status"
              @click="openModelVisible(record.userId)"
              >详细信息</a-button
            >
            <a-button
            :size="btnStyle.select.size"
            :type="btnStyle.delete.type"
              :status="btnStyle.delete.status"
              style="margin: 0 4px"
              @click="deleteIndustry(record.userId)"
              >删除</a-button
            >
          </template>
        </a-table-column>
      </template>
    </a-table>
    <!-- 用户详细信息对话框 -->
    <a-modal
      :footer="false"
      :width="580"
      :mask-closable="false"
      v-model:visible="userInfoModelVisible"
      @ok="userInfoModelOk"
      @cancel="userInfoModelCancel"
    >
      <template #title>{{
        itemUserInfo.length ? "用户详细信息" : '用户详细信息'
      }}</template>
    </a-modal>
    <!-- 用户简历对话框 -->
    <a-modal
      :footer="false"
      :width="1100"
      :mask-closable="false"
      v-model:visible="userInfoResumeModelVisible"
      @ok="userInfoResumeModelOk"
      @cancel="userInfoResumeModelCancel"
    >
      <template #title>TA的简历</template>
      <div class="resumeBox" style="padding:20px 30px">
      <OnlineResume :userId="userId"/>
      </div>
    </a-modal>
   
  </div>
</template>

<script setup lang="ts">
import { IconUser } from "@arco-design/web-vue/es/icon";
import {
  addIndustry,
  selUserInfo,
  updateIndustry,
  delIndustry,
  updateIndustryState,
} from "@/api";
import { Message, Modal } from "@arco-design/web-vue";
import { getTime, getTimeBefore } from "@/utils/formatTime";
import { IUserInfoData } from "@/types/userInfo";
import { useAuth } from "@/hooks/useAuth";
import {btnStyle} from "@/config/btnStyle"
import {useMangerStore} from "@/store/manger"
import OnlineResume from "./components/onlineResume/index.vue"
const manger_id = useMangerStore().manger_id
const userInfoModelVisible = ref(false);
const userInfoData = ref<IUserInfoData[]>([]);
const pageNationParams = reactive({
  pageOn: 1,
  pageSize: 15,
  total: 2,
});
const changePageNation = (pageOn: number) => {
  pageNationParams.pageOn = pageOn;
  getUserInfo();
};
onMounted(() => {
  getUserInfo();
});

//用户简历
const userId = ref('')
const userInfoResumeModelVisible = ref(false)
const openResumeModelVisible = (user_id:string)=>{
  userId.value=user_id
  userInfoResumeModelVisible.value = true
}
const userInfoResumeModelOk = () => {
  userInfoResumeModelVisible.value = false;
  userId.value = '';
};
const userInfoResumeModelCancel = () => {
  userInfoResumeModelVisible.value = false;
  userId.value = '';
};

const changeSwitch = async (state: any, userId: string) => {
  const res: any = await updateIndustryState({ state, userId });
  if (res.code !== 200) {
    Message.error(res.msg);
    getUserInfo();
    return;
  }
  Message.success("行业状态修改成功");
  getUserInfo();
};

//提交添加或修改
const validateForm = async (isShow: boolean = true, value: any) => {
  if (!isShow) return (userInfoModelVisible.value = false);
  if (!useAuth()) return;

  if (value?.userId) {
    const res: any = await updateIndustry(value);
    if (res.code !== 200) {
      return Message.error(res.msg);
    }
    Message.success(res.msg);
    userInfoModelVisible.value = false;
  } else {
    const res: any = await addIndustry({...value,manger_id});
    if (res.code !== 200) {
      return Message.error(res.msg);
    }
    Message.success(res.msg);
    userInfoModelVisible.value = false;
  }
  
  getUserInfo();
};

const itemUserInfo = ref<IUserInfoData[]>([]);

const loading = ref(false);
//获取资讯数据
const getUserInfo = async () => {
  loading.value = true;
  const res: any = await selUserInfo(pageNationParams);
  console.log(res)
  setTimeout(() => {
    if (res.code !== 200)
      return (userInfoData.value = []), (loading.value = false);
    loading.value = false;
    userInfoData.value = res.data;
    pageNationParams.total = res.total;
  }, 400);
};

const userInfoModelOk = () => {
  userInfoModelVisible.value = false;
  itemUserInfo.value = [];
};

const userInfoModelCancel = () => {
  userInfoModelVisible.value = false;
  itemUserInfo.value = [];
};

const openModelVisible = (userId?: string) => {
  userInfoModelVisible.value = true;
  if (userId) {
    itemUserInfo.value = userInfoData.value?.filter(
      (item) => item.userId === userId
    );
  }else{
    itemUserInfo.value =[]
  }
};


//点击删除
const deleteIndustry = (userId: string) => {
  Modal.warning({
    hideCancel: false,
    title: "温馨提示",
    content: "您确认要永久删除该管理员吗？",
    onOk: async () => {
      if (!useAuth()) return;
      const res: any = await delIndustry(userId);
      if (res.code !== 200) {
        return Message.error(res.msg);
      }
      Message.success(res.msg);
      getUserInfo();
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
