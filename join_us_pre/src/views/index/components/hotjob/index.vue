<template>
  <div class="hotjob-container">
    <p class="title">热招职位</p>
    <ul class="job-type" ref="lis" @click="changeOn($event)">
      <li class="on">技术</li>
      <li>金融</li>
      <li>产品</li>
      <li>物流</li>
      <li>教育培训</li>
      <li>采购/贸易</li>
      <li>法律/咨询</li>
      <li>房地产</li>
      <li>医疗健康</li>
    </ul>
    <div class="card-container" ref="cardContainer">
      <template v-if="jobList.length > 0" >
        <a-card
          
          style="width: 370px"
          v-for="(item) in jobList"
          :key="item.id"
        >
          <template #title>
            <div class="card_title">
              <span @click="toDetail(item)" class="job-name">{{
                item.jobName
              }}</span>
              <span class="job-salary">{{ item.salary }}</span>
            </div>
          </template>
          <span class="des">
            {{ item.place }}
          </span>
          <span class="des">
            {{ item.worktime }}
          </span>
          <span class="des">
            {{ item.education }}
          </span>
          <template #actions>
            <div style="text-align: left">
              <img :src="item.avatar" class="avatar" alt="" />
              <span>
                {{ item.companyName }}
              </span>
            </div>
            <div>
              <span>
                {{ item.jobType }}
              </span>
              <span> 不需要融资 </span>
            </div>
          </template>
        </a-card>
      </template>
        <p v-else>暂无职位</p>
        <a-button class="more-job" type="primary" @click="router.push('/home/job')">查看更多职位</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { jobDetailStore } from "@/store/jobDetail";
const router = useRouter();
const lis = ref();
const cardContainer = ref();
import { Iobj } from '@/types/jobType'
const jobList = ref<Array<Iobj>>([]);
let allJobList = ref<Array<Iobj>>([]);
const job = jobDetailStore();
allJobList.value = job.allJobList;
jobList.value = job.allJobList
  .filter((item: any) => item.jobType === "互联网")
  .slice(0, 9);

const changeOn = (e: any): void => {
  Array.from(lis.value.children).forEach((item: any) => {
    if (item.className.includes("on")) {
      item.classList.remove("on");
    }
  });
  e.target.classList.add("on");
  jobList.value = allJobList.value
    .filter((item) => item.jobType === e.target.innerHTML)
    .slice(0, 9);
};
const toDetail = (item: Iobj) => {
  router.push({
    path: "/home/jobDetail",
    query: {
      id: item.id,
    },
  });
};
</script>

<style lang="less" scoped>
.hotjob-container {
  width: 1200px;
  height: 850px;
  margin: 0 auto;

  .title {
    width: 200px;
    height: 80px;
    font-size: 25px;
    font-weight: bold;
    color: var(--themeColor);
    margin: 10px auto;
    text-align: center;
    line-height: 80px;
  }

  .job-type {
    width: 1200px;
    height: 40px;
    display: flex;
    border-bottom: 1px solid #888;
    font-size: 18px;
    line-height: 40px;
    justify-content: space-evenly;
    li {
      text-align: center;
      width: 100px;

      &.on {
        border-bottom: 3px solid var(--themeColor);
      }
    }
  }

  .card-container {
    width: 1200px;
    height: 300px;
    margin: 25px auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    .ant-card {
      margin: 5px;
    }

    .card_title {
      display: flex;
      justify-content: space-between;

      .job-name {
        font-weight: bold;
        font-size: 18px;
      }

      .job-salary {
        color: #fe7154;
      }
      &:hover{
        color: var(--themeColor);
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
      width: 30px;
      height: 25px;
      font-size: 10px;
      text-align: center;
      line-height: 25px;
      border-radius: 5px;
      background-color: #f8f8f8;
      color: #000;
      margin: 0 5px;
    }
  }
  .more-job {
    margin-top: 15px;
    width: 150px;
    height: 50px;
    background-color: #d5bdea;
    color: var(--themeColor);
    border: none;
    font-weight: bold;
    transition: all 0.2s;
    &:hover {
      background-color: var(--themeColor);
      color: #fff;
    }
  }
  .ant-card:hover{
    box-shadow: 0 16px 40px 0 hsla(0, 0%, 60%, 0.3);
  }
}
</style>
