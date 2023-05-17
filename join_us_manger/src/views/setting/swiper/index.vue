<template>
  <div class="manger">
    <a-button type="primary" @click="openModelVisible()">添加轮播</a-button>
    <a-table
      class="table"
      @page-change="changePageNation"
      :pagination="pageNationParams"
      :data="swiperData"
      :loading="loading"
    >
      <template #columns  >
        <a-table-column title="轮播图片" :width="300" data-index="img">
          <template #cell="{ record }">
            <div class="photos">
              <img :src="record.img"  alt="">
            </div>
        </template>
        </a-table-column>
        <a-table-column title="添加人信息" data-index="name">
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
        <a-table-column title="链接" ellipsis tooltip :width="200" data-index="links"></a-table-column>
        <a-table-column title="备注" ellipsis tooltip :width="100" data-index="others"></a-table-column>
        <a-table-column title="轮播状态">
          <template #cell="{ record }">
            <a-switch
              @change="changeSwitch($event, record.swiper_id)"
              v-model="record.state"
              checked-value="1"
              uncheckedValue="0"
              :disabled="!useAuth(false)"
            >
              <template #checked> 显示 </template>
              <template #unchecked> 隐藏 </template>
            </a-switch>
          </template>
        </a-table-column>
        <a-table-column title="上传时间" data-index="addTime">
          <template #cell="{ record }">
            <a-tooltip :content="getTime(record.addTime, 'time')">
              <span>{{ getTimeBefore(record.addTime) }}</span>
            </a-tooltip>
          </template>
        </a-table-column>
        <a-table-column title="操作" data-index="category">
          <template #cell="{ record }">
           
            <a-button
            :size="btnStyle.select.size"
              style="margin: 0 10px"
              :type="btnStyle.editor.type"
              :status="btnStyle.editor.status"
              @click="openModelVisible(record.swiper_id)"
              >编辑</a-button
            >
            <a-button
            :size="btnStyle.select.size"
            :type="btnStyle.delete.type"
              :status="btnStyle.delete.status"
              @click="deleteSwiper(record.swiper_id)"
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
      v-model:visible="swiperModelVisible"
      @ok="swiperModelOk"
      @cancel="swiperModelCancel"
    >
      <template #title>{{
        itemSwiper.length ? "编辑轮播" : "添加轮播"
      }}</template>
      <SwiperForm
        :swiperModelVisible="swiperModelVisible"
        :validateForm="validateForm"
        :itemSwiper="itemSwiper"
      />
    </a-modal>
   
  </div>
</template>

<script setup lang="ts">
import { IconUser,IconSearch,IconRefresh } from "@arco-design/web-vue/es/icon";
import SwiperForm from "./components/swiperForm/index.vue";
import {
  addSwiper,
  selSwiperAll,
  updateSwiper,
  delSwiper,
  updateSwiperState,
} from "@/api";
import { Message, Modal } from "@arco-design/web-vue";
import { getTime, getTimeBefore } from "@/utils/formatTime";
import { ISwiperData } from "@/types/swiper";
import { useAuth } from "@/hooks/useAuth";
import {btnStyle} from "@/config/btnStyle"
import {useMangerStore} from "@/store/manger"
const manger_id = useMangerStore().manger_id
const swiperModelVisible = ref(false);
const swiperData = ref<ISwiperData[]>([]);
const pageNationParams = reactive({
  pageOn: 1,
  pageSize: 15,
  total: 2,
});

//搜索
const keyword=ref('')
const changeSelect =  ()=>{
  pageNationParams.pageOn = 1
  getIndustry();
}
const clearSelect = ()=>{
  pageNationParams.pageOn = 1
  keyword.value = ''
  getIndustry();
}
const changePageNation = (pageOn: number) => {
  pageNationParams.pageOn = pageOn;
  getIndustry();
};
onMounted(() => {
  getIndustry();
});

const changeSwitch = async (state: any, swiper_id: string) => {
  const res: any = await updateSwiperState({ state, swiper_id });
  if (res.code !== 200) {
    Message.error(res.msg);
    getIndustry();
    return;
  }
  Message.success("状态修改成功");
  getIndustry();
};

//提交添加或修改
const validateForm = async (isShow: boolean = true, value: any) => {
  if (!isShow) return (swiperModelVisible.value = false);
  if (!useAuth()) return;
  if (value?.swiper_id) {
    const res: any = await updateSwiper(value);
    if (res.code !== 200) {
      return Message.error(res.msg);
    }
    Message.success(res.msg);
    swiperModelVisible.value = false;
  } else {
    const res: any = await addSwiper({...value,manger_id});
    if (res.code !== 200) {
      return Message.error(res.msg);
    }
    Message.success(res.msg);
    swiperModelVisible.value = false;
  }
  
  getIndustry();
};

const itemSwiper = ref<ISwiperData[]>([]);

const loading = ref(false);
//获取资讯数据
const getIndustry = async () => {
  loading.value = true;
  const res: any = await selSwiperAll({...pageNationParams,keyword:keyword.value});
  setTimeout(() => {
    if (res.code !== 200)
      return (swiperData.value = []), (loading.value = false);
    loading.value = false;
    swiperData.value = res.data;
    pageNationParams.total = res.total;
  }, 400);
};

const swiperModelOk = () => {
  swiperModelVisible.value = false;
  itemSwiper.value = [];
};

const swiperModelCancel = () => {
  swiperModelVisible.value = false;
  itemSwiper.value = [];
};

const openModelVisible = (swiper_id?: string) => {
  swiperModelVisible.value = true;
  if (swiper_id) {
    itemSwiper.value = swiperData.value?.filter(
      (item) => item.swiper_id === swiper_id
    );
  }else{
    itemSwiper.value =[]
  }
};


//点击删除
const deleteSwiper = (swiper_id: string) => {
  Modal.warning({
    hideCancel: false,
    title: "温馨提示",
    content: "您确认要永久删除该轮播吗？",
    onOk: async () => {
      if (!useAuth()) return;
      const res: any = await delSwiper(swiper_id);
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
  .select{
    display: flex;
    .item{
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

.photos{
  width: 230px;
  height: 140px;
  img{
    width: 100%;
    height: 100%;
  }
  background: #000;
}
</style>
