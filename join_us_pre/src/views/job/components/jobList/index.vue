<template>
  <div class="jobList" v-for="item in positionData" :key="item.position_id">
    <div class="top">
      <div class="left">
        <p class="jobName" @click="navigateDetail(item.position_id)">{{ item.position_name }} [{{item.cityName}}] </p>
        <p class="info">
          <b class="salary">{{ item.salary }}</b>
          <span class="year">{{ item.experiences }}</span>
          <span class="xl">{{ item.degrees }}</span>
        </p>
      </div>
      <div class="right">
        <div class="right_left">
          <img :src="item.logo" alt="" />
        </div>
        <div class="right_right">
          <p class="company">{{ item.company_name }}</p>
          <p class="infos">
            <span class="types">{{ item.industry }}</span>
            <span class="rz">{{ item.financing }}</span>
            <span class="num">{{ item.people_num }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="left" >
        <span v-for="item1 in JSON.parse(item.position_tag)" :key="item1">{{ item1 }}</span>
      </div>
      <div class="bottom_right">
        {{ JSON.parse(item.welfare_tag).join(',') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface RootObject {
  id: number;
  position_id: string;
  position_name: string;
  salary: string;
  cityName: string;
  region: string;
  experiences: string;
  degrees: string;
  position_tag: string;
  welfare_tag: string;
  company_id: string;
  hr_id: string;
  position_desc: string;
  addTime: string;
  updateTime: string;
  position_state: string;
  position_type1: string;
  position_type2: string;
  job_type: string;
  company_name: string;
  logo: string;
  people_num: string;
  industry: string;
  financing: string;
  legal_representative: string;
  create_time: string;
  reg_city: string;
  capital: string;
  state: string;
  business_scope: string;
  others: string;
}
withDefaults(defineProps<{positionData:RootObject[]}>(),{})
  // defineProps(['positionData'])

  const navigateDetail = (position_id:string)=>{
    window.open(`/home/jobDetail?position_id=${position_id}`)
  }
</script>

<style lang="less" scoped>
.jobList {
  border-radius: var(--radiusSize);
  height: 140px;
  width: 100%;
  transition: all 0.2s linear;
  cursor: pointer;
  background: #fff;
  overflow: hidden;
  margin-bottom: 20px;
  &:hover {
    box-shadow: 0 16px 40px 0 hsla(0, 0%, 60%, 0.3);
  }
  .top {
    width: 100%;
    height: 90px;
    background: #fff;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    p {
      margin: 0;
    }
    .left {
      width: 484px;
      padding: 14px 0 16px 24px;
      box-sizing: border-box;
      &:hover {
        .jobName {
          color: var(--themeColor);
        }
      }
    }
    .jobName {
      font-size: 16px;
      font-weight: 500;
      color: #222;
      transition: all 0.3s linear;
      &:hover {
        color: var(--themeColor);
      }
    }
    .info {
      margin-top: 6px;
      .salary {
        font-size: 16px;
        font-weight: 500;
        color: #fe574a;
      }
      span {
        margin-left: 14px;
        padding: 2px 8px;
        background: #f8f8f8;
        font-size: 13px;
        font-weight: 400;
        color: #666;
      }
    }
  }
  .right {
    padding: 14px 0 16px;
    box-sizing: border-box;
    width: 440px;
    display: flex;
    justify-content: center;
    align-items: center;
    .right_left {
      width: 56px;
      height: 56px;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        widows: 100%;
        height: 100%;
      }
    }
    .right_right {
      margin-left: 10px;
      .company {
        font-size: 16px;
        color: #222;
        position: relative;
        top: -2px;
        transition: all 0.3s linear;
        &:hover {
          color: var(--themeColor);
        }
      }
      .infos {
        span {
          padding: 2px 8px;
          margin-right: 8px;
          background: #f8f8f8;
        }
        font-size: 12px;
        font-weight: 400;
        color: #666;
        margin-top: 8px;
      }
    }
  }
}
.bottom {
  width: 100%;
  height: 55px;
  background: linear-gradient(90deg, #f5fcfc, #fcfbfa);
  display: flex;
  padding: 15px 24px;
  box-sizing: border-box;
  justify-content: flex-start;
  .left {
    width: 480px;
    overflow: hidden;
    span {
      font-size: 13px;
      font-weight: 400;
      color: #666;
      margin:0 10px;
      position: relative;
      &::after {
        content: " ";
        position: absolute;
        top: 4px;
        right: -10px;
        width: 1px;
        height: 10px;
        background: #e0e0e0;
        z-index: 1;
      }
      &:first-child{
        margin-left: 0;
      }
      &:last-child{
        &::after {
        content: " ";
        position: absolute;
        top: 4px;
        right: -10px;
        width: 1px;
        height: 10px;
        background: none;
        z-index: 1;
      }
      }
    }
  }
  .bottom_right {
    width: 362px;
    font-size: 13px;
    font-weight: 400;
    color: #666;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: right;
  }
}
</style>
