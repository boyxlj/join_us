<template>
  <div class="jobList" v-for="(item, index) in positionData" :key="index">
    <div class="top">
      <div class="left">
        <p class="jobName" @click="navigateDetail(item.position_id)">
          {{ item.position_name }} [{{ item.cityName }}]
        </p>
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
          <p class="company" @click="navigateCompanyDetail(item.company_id)">
            {{ item.company_name }}
          </p>
          <p class="infos">
            <span class="types" :title="item.industry">{{
              item.industry
            }}</span>
            <span class="rz" :title="item.financing">{{ item.financing }}</span>
            <span class="num" :title="item.people_num">{{
              item.people_num
            }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="left">
        <span v-for="item1 in JSON.parse(item.position_tag)" :key="item1">{{
          item1
        }}</span>
      </div>
      <div class="bottom_right">
        {{ JSON.parse(item.welfare_tag).join(',') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Iposition_type } from '@/types/jobType'
withDefaults(defineProps<{ positionData: Iposition_type[] }>(), {})

const navigateDetail = (position_id: string) => {
  window.open(`/#/home/jobDetail?position_id=${position_id}`)
}
const navigateCompanyDetail = (company_id: string) => {
  window.open(`/#/home/companyDetail?company_id=${company_id}`)
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
        width: 100%;
        height: 100%;
      }
    }

    .right_right {
      margin-left: 10px;
      width: 300px;
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
          display: inline-block;
        }

        font-size: 12px;
        font-weight: 400;
        color: #666;
        margin-top: 8px;
        .types,
        .rz,
        .num {
          max-width: 120px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .types {
          max-width: 130px;
        }
        .rz {
          max-width: 80px;
        }
        .num {
          max-width: 90px;
        }
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
      margin: 0 10px;
      position: relative;

      &::after {
        content: ' ';
        position: absolute;
        top: 4px;
        right: -10px;
        width: 1px;
        height: 10px;
        background: #e0e0e0;
        z-index: 1;
      }

      &:first-child {
        margin-left: 0;
      }

      &:last-child {
        &::after {
          content: ' ';
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
