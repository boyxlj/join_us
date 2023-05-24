<template>
    <div class="detail-header">
      <div class="info-title">
        <div class="name-salary-row">
          <div class="row-first">
            <span>{{ jobDetailData?.position_name }}</span>
            <span>{{ jobDetailData?.salary }}</span>
          </div>
          <div v-if="welfare_tagArr.length > 0" class="row-last">
            <span v-for="item in 3" :key="item">{{
              welfare_tagArr[item]
            }}</span>
            <span
              @mouseenter="welfare_tagShown = true"
              @mouseleave="welfare_tagShown = false"
              v-if="welfare_tagArr.length > 3"
              >...</span
            >
          </div>
          <a-card v-show="welfare_tagShown" class="welfare-card">
            <span
              class="welfare_tag"
              v-for="(item, index) in welfare_tagArr"
              :key="index"
              >{{ item }}</span
            >
          </a-card>
        </div>
        <div class="info">
          <EnvironmentOutlined :style="{ fontSize: '20px', color: '#fff' }" />
          <span>{{ jobDetailData.cityName }}</span>
          <ShoppingOutlined :style="{ fontSize: '20px', color: '#fff' }" />
          <span>{{ jobDetailData.experiences }}</span>
          <BankOutlined :style="{ fontSize: '20px', color: '#fff' }" />
          <span>{{ jobDetailData.degrees }}</span>
        </div>
        <a-button
          v-if="!collectState"
          @click="clickCollectBtn"
          class="gxq"
          @mouseenter="isIn = true"
          @mouseleave="isIn = false"
        >
          <template #icon>
            <StarOutlined v-if="!isIn" />
            <StarFilled v-else />
          </template>
          <span>感兴趣</span>
        </a-button>
        <a-button class="gxq" @click="cancelCollectBtn" v-else>
          <template #icon>
            <StarFilled />
          </template>
          <span>取消感兴趣</span>
        </a-button>
        <a-button
          type="primary"
          v-if="!sendState"
          class="chat"
          @click="clickSendBtn"
          >立即投递</a-button
        >
        <a-button v-else  type="primary" class="chat" @click="cancelSendBtn">取消投递</a-button>
      </div>
    </div>
    <div class="info-container">
      <a-card class="xx-info">
        <p class="ms">
          <span>职位描述</span>
          <span>
            <WarningOutlined />
            <a>举报该职位</a>
          </span>
        </p>
        <div class="mark">
          <span>{{ jobDetailData.industry }}</span>
          <span>{{ jobDetailData.job_type }}</span>
          <template v-if="desc_tagArr.length > 0">
            <span v-for="(item, index) in desc_tagArr" :key="index">{{
              item
            }}</span>
          </template>
        </div>
        <div  class="position-desc"> <pre style="white-space:pre-wrap;word-wrap:break-word;">{{jobDetailData.position_desc}}</pre> </div>
        <div class="company-info-container">
          <div class="info" @click="navigateCompanyDetail(jobDetailData.company_id)">
            <img class="company-avatar" :src="jobDetailData.logo" alt="" />
            <div class="detail-info">
              <span>{{ jobDetailData.company_name }}</span>
              <span
                ><span>{{ jobDetailData.company_name }}</span
                >|<span>校招hr</span></span
              >
            </div>
          </div>
        </div>
      </a-card>
      <div class="aside">
        <salaryCaculate />
      </div>
    </div>
</template>

<script lang="ts" setup>
import {
  ShoppingOutlined,
  WarningOutlined,
  EnvironmentOutlined,
  BankOutlined,
  StarOutlined,
  StarFilled,
} from "@ant-design/icons-vue";
import { Iposition_type } from "@/types/jobType";
import salaryCaculate from "./components/salaryCaculate/index.vue";
import {
  getJobDetail,
  addSend,
  addCollect,
  collectOrSendState,
  deleteCollect,
  cancelOrDelSend,
} from "@/api";
import { useUserInfo } from "@/store/user";
import { useUserLoginState } from "@/hooks/useUserLoginState";
import { useValidateResume } from "@/hooks/useValidateResume";
import { message } from "ant-design-vue";
const router = useRouter();
const route = useRoute();
let isIn = ref(false);
const jobId = route.query.position_id;
let jobDetailData = ref<Iposition_type>({} as Iposition_type);
let welfare_tagArr = ref<string[]>([]);
let welfare_tagShown = ref(false);
let desc_tagArr = ref<string[]>([]);
const { userId } = useUserInfo();
const clickSendBtn = async () => {
  if (!useUserLoginState()) return;
  if (!useValidateResume()) return;
  const { position_id, company_id, hr_id } = jobDetailData.value;
  const res: any = await addSend({ position_id, company_id, hr_id, userId });
  if (res.code !== 200) return message.error(res.msg);
  message.success("投递成功");
  getState();
};
const clickCollectBtn = async () => {
  if (!useUserLoginState()) return;
  const { position_id, company_id } = jobDetailData.value;
  const res: any = await addCollect({ position_id, company_id, userId });
  if (res.code !== 200) return message.error(res.msg);
  message.success("收藏成功");
  getState();
};

//获取用户的收藏和投递状态
const collectState = ref(false);
const sendState = ref(false);
const getState = async () => {
  if (!useUserLoginState(true)) return;
  const res: any = await collectOrSendState({ userId, position_id: jobId });
  collectState.value = res.collectState;
  sendState.value = res.sendState;
  useUserInfo().getAllSendNum();
};

//取消投递
const cancelSendBtn = async () => {
  if (!useUserLoginState()) return;
  const res: any = await cancelOrDelSend({ userId, position_id: jobId });
  if (res.code !== 200) return message.error("取消投递失败");
  message.success("已取消投递");
  getState();
};
//取消收藏
const cancelCollectBtn = async () => {
  if (!useUserLoginState()) return;
  const res: any = await deleteCollect({ userId, position_id: jobId });
  if (res.code !== 200) return message.error("删除收藏失败");
  message.success("已从感兴趣中移除");
  getState();
};

onMounted(() => {
  getJobDetail(jobId as string).then((res) => {
    if (!res.data) return router.replace("/notFound");
    jobDetailData.value = res.data as Iposition_type;
    welfare_tagArr.value = JSON.parse(jobDetailData.value.welfare_tag);
    desc_tagArr.value = JSON.parse(jobDetailData.value.position_tag);
    // 添加感叹号表示该元素一定存在
    if (res.data.position_name) {
      document.title =  res.data.position_name;
    }
    // desc.value!.innerHTML = jobDetailData.value.position_desc;
    if (res.data.position_state !== "1") return router.replace("/notFound");
  });
  getState();
});

const navigateCompanyDetail = (company_id: string) => {
  window.open(`/home/companyDetail?company_id=${company_id}`)
}
</script>

<style lang="less" scoped>
.detail-header {
  width: 100%;
  height: 200px;
  background-color: #38556b;

  .info-title {
    width: 1200px;
    height: 200px;
    margin: 0 auto;
    padding-top: 20px;

    .name-salary-row {
      width: 1200px;
      height: 40px;
      display: flex;
      justify-content: space-between;
      padding-left: 40px;
      position: relative;

      .row-first {
        span:first-of-type {
          font-size: 22px;
          margin-right: 20px;
          font-size: 28px;
          font-weight: 600;
          color: #fff;
        }

        span:last-of-type {
          color: #f26d49;
          font-size: 34px;
          position: relative;
          top: 3px;
          font-family: kanzhun-Regular, kanzhun;
        }
      }

      .row-last {
        min-width: 300px;
        height: 40px;

        span {
          display: inline-block;
          min-width: 40px;
          height: 25px;
          background: rgba(255, 255, 255, 0.05);
          margin-right: 10px;
          text-align: center;
          line-height: 15px;
          padding: 5px;
          color: #fff;
          border-radius: 5px;
        }
      }
      .welfare-card {
        position: absolute;
        right: 30px;
        top: 35px;
        max-width: 600px;
        min-height: 70px;
        display: flex;
        flex-wrap: wrap;
        .welfare_tag {
          display: inline-block;
          min-width: 40px;
          height: 25px;
          background-color: var(--themeColor);
          margin-right: 10px;
          text-align: center;
          line-height: 15px;
          padding: 5px;
          color: #fff;
          border-radius: 5px;
          margin-right: 10px;
          margin-bottom: 5px;
        }
      }
    }

    .info {
      width: 250px;
      height: 30px;
      margin: 25px 0 -5px 40px;

      span {
        display: inline-block;
        height: 30px;
        line-height: 30px;
        vertical-align: middle;
        margin: 0 3px;
        color: #fff;
      }
    }

    .gxq {
      margin-left: 40px;
      margin-top: 20px;
      min-width: 120px;
      height: 50px;
      font-size: 17px;
      background-color: transparent;
      color: #fff;
      border-color: var(--themeColor);
    }

    .chat {
      margin-left: 20px;
      margin-top: 20px;
      width: 120px;
      height: 50px;
      font-size: 17px;
      border: none;
      color: #fff;
    }
  }
}
.info-container {
  width: 1200px;
  min-height: 600px;
  margin: 15px auto;
  padding: 20px;
  display: flex;

  .xx-info {
    width: 800px;
    min-height: 500px;
    border-radius: 15px;

    .ms {
      display: flex;
      justify-content: space-between;

      & > span:first-of-type {
        font-size: 24px;
        font-weight: bold;
      }
    }

    .mark {
      width: 100%;
      height: 40px;
      margin: 15px 0;

      span {
        display: inline-block;
        min-width: 60px;
        background-color: #f8f8f8;
        line-height: 20px;
        text-align: center;
        margin-right: 15px;
        color: #666;
        padding: 4px 12px;
        border-radius: var(--radiusSize);
      }
    }
    .position-desc {
      width: 90%;
      min-height: 100px;
    }
    .company-info-container {
      width: 850px;
      height: 100px;
      margin-top: 20px;

      .info {
        height: 100px;
        width: 300px;
        display: flex;
        align-items: center;

        .company-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          cursor: pointer;
        }

        .detail-info {
          height: 80px;
          margin-left: 15px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          cursor: pointer;

          & > span:first-of-type {
            font-size: 20px;
            font-weight: bold;
          }

          & > span:last-of-type {
            span:first-of-type {
              margin-right: 15px;
            }

            span:last-of-type {
              margin-left: 15px;
            }
          }
        }
      }
    }
  }
  .aside {
    width: 300px;
    height: 400px;
    margin-left: 20px;
  }
}
</style>
