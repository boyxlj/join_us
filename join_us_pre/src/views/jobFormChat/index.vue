<template>
  <div class="jobFormChat">
    <div class="left">
      <div class="nav">
        <li class="back" @click="$router.go(-1)"><span></span>返回</li>
        <ul class="select">
          <li
            @click="changeActiveIndx(index)"
            :class="activeIdx === index ? 'active' : ''"
            v-for="(item, index) in selectList"
            :key="index"
          >
            {{ item }}
          </li>
        </ul>
      </div>
      <div class="list">
        <a-spin size="large" class="loading" v-if="loading" />
        <template v-else>
          <sendListComponent
            @refreshData="refreshData"
            :activeIdx="activeIdx"
            :sendList="sendList"
            v-if="sendList.length"
          />
            <Empty v-else msg="没有查询到相对应的数据" />
        </template>
      </div>
      <a-pagination
        @change="changePageNation"
        :pageSize="formPageNation.pageSize"
        v-model:current="formPageNation.pageOn"
        :total="total"
        show-less-items
        class="pageNation"
        v-if="sendList.length && !loading"
      />
    </div>
    <div class="right">
      <UserInfoBox />
      <PositionCard origin="sort" title="最新职位"></PositionCard>
      <PositionCard></PositionCard>
    </div>
    <div class="navbar">
      <Navbar />
    </div>
  </div>
</template>

<script setup lang="ts">
import sendListComponent from "./components/sendList/index.vue";
import UserInfoBox from "@/components/common/userInfoBox/index.vue";
import PositionCard from "@/components/common/positionCard/index.vue";
import { selectSend, selectCollect } from "@/api";
import { ISendData } from "@/types/send";
import { useUserInfo } from "@/store/user";
import Empty from "@/components/common/empty/index.vue";
const router = useRouter();
const route = useRoute();
const { userId } = useUserInfo();
const formPageNation = reactive({
  pageOn: 1,
  pageSize: 15,
});

onMounted(() => {
  if (!route.query.tag) {
    router.push(`/home/user/jobs/fromChat?tag=${0}`);
  } else {
    activeIdx.value = (route.query.tag as any) * 1;
  }
});
const total = ref(0);
const sendList = ref<ISendData[]>([]);
onMounted(() => {
  getUserSends();
});

//取消或删除投递记录成功后更新数据
const refreshData = () => {
  getUserSends();
  useUserInfo().getAllSendNum();
};

watch(
  () => route.fullPath,
  () => {
    activeIdx.value = (route.query.tag as any) * 1;
  }
);

const loading = ref(false);
const changePageNation = (page: number, pageSize: number) => {
  formPageNation.pageOn = page;
  document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
  getUserSends();
};

const noLoading = ref(true);
//获取投递数据
const getUserSends = async () => {
  if (noLoading.value) {
    loading.value = true;
  }
  let res: any = null;
  if (activeIdx.value === 3) {
    res = await selectCollect({ userId, ...formPageNation });
  } else {
    res = await selectSend({
      types: activeIdx.value,
      userId,
      ...formPageNation,
    });
  }

  if (res.code !== 200) {
    return (sendList.value = []);
  }
  if (noLoading.value) {
    setTimeout(() => {
      total.value = res.total;
      sendList.value = res.data;
      loading.value = false;
    }, 1000);
  } else {
    total.value = res.total;
    sendList.value = res.data;
    loading.value = false;
  }
  noLoading.value = false;
};

const selectList = ["已投递", "约面试", "不合适", "感兴趣"];
const activeIdx = ref(0);
const changeActiveIndx = (idx: number) => {
  if (loading.value) return;
  activeIdx.value = idx;
  noLoading.value = true;
  formPageNation.pageOn = 1;
  router.push(`/home/user/jobs/fromChat?tag=${idx}`);
  getUserSends();
};
</script>

<style lang="less" scoped>
.jobFormChat {
  width: 1200px;
  margin: 25px auto;
  display: flex;
  justify-content: space-between;
  .left {
    width: 73%;
    min-height: 500px;
    .nav {
      width: 100%;
      height: 50px;
      border-radius: var(--radiusSize);
      background: #fff;
      box-sizing: border-box;
      padding: 4px 30px;
      display: flex;
      align-items: center;
      li {
        cursor: pointer;
      }
      .back {
        color: #333;
        font-size: 16px;
        position: relative;
        transition: all 0.25s linear;
        &:hover {
          color: var(--themeColor);
          span {
            border-right: 6px solid var(--themeColor);
          }
        }
        span {
          transition: all 0.2s linear;
          display: inline-block;
          border: 6px solid transparent;
          border-right: 6px solid #cccccc;
          margin-right: 10px;
        }
        &::after {
          width: 0.5px;
          height: 60%;
          background: #cccccc;
          content: "";
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: -28px;
        }
      }
      .select {
        height: 100%;
        align-items: center;
        display: flex;
        margin: 0 0 0 30px;
        li {
          margin: 0 20px;
          color: #333;
          font-size: 16px;
          transition: all 0.3s linear;
          &:hover {
            color: var(--themeColor);
          }
        }
        .active {
          color: var(--themeColor);
          position: relative;
          &::after {
            content: "";
            position: absolute;
            width: 70%;
            left: 50%;
            height: 3.5px;
            transform: translateX(-50%);
            bottom: -12px;
            background: var(--themeColor);
            border-radius: var(--radiusSize);
          }
        }
      }
    }
    .list {
      margin-top: 20px;
      .loading {
        width: 100%;
        height: 360px;
        display: flex;
        justify-content: center;
        align-items: center;
        // background: #fff !important;
        border-radius: 10px;
      }
     
    }
  }
  .right {
    width: 25.5%;
    min-height: 500px;
  }
}

.pageNation {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
}
.navbar {
  position: fixed !important;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
}
</style>
