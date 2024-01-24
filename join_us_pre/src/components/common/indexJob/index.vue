<template>
  <div class="card-container" ref="cardContainer">
    <template v-if="hotJobList.length > 0">
      <a-card
        v-for="item in hotJobList"
        :key="item.position_id"
        style="width: 390px"
        @click="toDetail(item)"
      >
        <template #title>
          <div class="card_title">
            <span class="job-name">{{ item.position_name }}</span>
            <span class="job-salary">{{ item.salary }}</span>
          </div>
        </template>
        <span class="des">
          {{ item.cityName }}
        </span>
        <span class="des">
          {{ item.experiences }}
        </span>
        <span class="des">
          {{ item.degrees }}
        </span>
        <template #actions>
          <div @click="navigateCompanyDetail(item.company_id)" style="text-align: left">
            <img style="margin-left:18px" :src="item.logo" class="avatar" alt="" />
            <span>
              {{ item.company_name }}
            </span>
          </div>
          <div class="rz">
            <span style="margin-right: 10px">
              {{ item.job_type }}
            </span>
            <span> {{ item.financing ? item.financing : "不需要融资" }} </span>
          </div>
        </template>
      </a-card>
    </template>
    <p v-else>暂无职位</p>
    <a-button class="more-job" type="primary" @click="router.push('/home/job')"
      >查看更多职位</a-button
    >
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { Iposition_type } from "@/types/jobType";
import { PropType } from "vue";
const router = useRouter();
const props = defineProps({
  hotJobList: {
    type: Array as PropType<Iposition_type[]>,
    default: () => [],
  },
});

const navigateCompanyDetail = (company_id: string) => {
  window.open(`/#/home/companyDetail?company_id=${company_id}`)
}
// 跳转详情页
const toDetail = (item: Iposition_type) => {
  // router.push({
  //     path: "/home/jobDetail",
  //     query: {
  //         position_id: item.position_id,
  //     },
  // });
  window.open(`/#/home/jobDetail?position_id=${item.position_id}`);
};
</script>

<style lang="less" scoped>
.card-container {
  width: 1200px;
  height: 300px;
  margin: 25px auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .ant-card {
    margin: 5px;
    transition: all 0.2s linear;
    cursor: pointer;
    border-radius: 10px;
    &:hover {
      box-shadow: 0 16px 40px 0 hsla(0, 0%, 60%, 0.3);
      .card_title {
        .job-name {
          color: var(--themeColor);
        }
      }
    }
    ::v-deep(.ant-card-actions) {
      border-radius: 0 0 10px 10px;
      display: flex;
      justify-content: space-between;
      background: linear-gradient(90deg, #f5fcfc, #fcfbfa);
      border-top: none;
    }
    ::v-deep(.ant-card-head) {
      height: 35px;
      border-bottom: none;
    }
  }

  .card_title {
    display: flex;
    justify-content: space-between;
    .job-name {
      font-size: 17px;
      color: #222;
      transition: all 0.2s linear;
    }

    .job-salary {
      color: #fe7154;
    }
  }

  .avatar {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-right: 10px;
    margin-left: 10px;
  }

  .des {
    display: inline-block;
    min-width: 30px;
    font-size: 10px;
    text-align: center;
    line-height: 20px;
    border-radius: 5px;
    background-color: #f8f8f8;
    color: #666;
    padding: 2px 12px;
    margin-right: 8px;
  }
}
.more-job {
  margin: 0 auto;
  margin-top: 35px;
  width: 185px;
  height: 40px;
  color: var(--themeColor);
  border: none;
  font-size: 14px;
  font-weight: 400;
  border-radius:var(--radiusSize);
  transition: all 0.14s linear;
  background: rgba(182, 79, 219, 0.1);
  background:rgb(138, 215, 246);
  color: #fff;
  &:hover {
    border-radius:var(--radiusSize) !important;
    background-color: var(--themeColor);
    color: #fff;
  }
}

.rz {
  margin-left: 50px;
}
</style>
