<template>
    <div class="card-container" ref="cardContainer">
          <template v-if="hotJobList.length > 0">
            <a-card
              v-for="(item, index) in hotJobList"
              :key="item.position_id"
              style="width: 390px"
            >
              <template #title>
                <div class="card_title">
                  <span @click="toDetail(item)" class="job-name">{{
                      item.position_name
                  }}</span>
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
                <div style="text-align: left">
                  <img :src="item.logo" class="avatar" alt="" />
                  <span>
                    {{ item.company_name }}
                  </span>
                </div>
                <div>
                  <span>
                    {{ item.job_type }}
                  </span>
                  <span> 不需要融资 </span>
                </div>
              </template>
            </a-card>
          </template>
            <p v-else>暂无职位</p>
            <a-button class="more-job" type="primary" @click="router.push('/home/job')">查看更多职位</a-button>
        </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Iposition_type } from '@/types/jobType'
import { PropType } from 'vue';
const router = useRouter()
const props = defineProps({
    hotJobList: {
        type: Array as PropType<Iposition_type[]>,
        default: () => []
    }
})
// 跳转详情页
const toDetail = (item: Iposition_type) => {
    // router.push({
    //     path: "/home/jobDetail",
    //     query: {
    //         position_id: item.position_id,
    //     },
    // });
    window.open(`/home/jobDetail?position_id=${item.position_id}`)
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
      min-width: 30px;
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
    margin: 0 auto;
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
</style>