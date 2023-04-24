<template>
  <div class="detail-header">
    <div class="info-title">
      <div class="name-salary-row">
        <div class="row-first">
          <span>阿里巴巴</span>
          <span>6-8k</span>
        </div>
        <div class="row-last">
          <span>五险一金</span>
          <span>医疗保险</span>
          <span>定期体检</span>
          <span>年终奖</span>
          <span>...</span>
        </div>
      </div>
      <div class="info">
        <EnvironmentOutlined :style="{ fontSize: '20px', color: '#fff' }" />
        <span>武汉</span>
        <ShoppingOutlined :style="{ fontSize: '20px', color: '#fff' }" />
        <span>不限</span>
        <BankOutlined :style="{ fontSize: '20px', color: '#fff' }" />
        <span>本科</span>
      </div>
      <a-button class="gxq" @mouseenter="isIn = !isIn" @mouseleave="isIn = !isIn">
        <template #icon>
          <component :is="isIn ? StarFilled : StarOutlined"></component>
        </template>
        <span>感兴趣</span>
      </a-button>
      <a-button class="chat">立即沟通</a-button>
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
        <span>计算机</span>
        <span>前端</span>
      </div>
      <pre>
        需要本科学历
        我们提供：
        1、国内领先的在线教育企业
        2、入职即缴纳五险一金
        3、双休，按照国家法定节假日休假
        任职要求：
        1、 具备极强的责任心、协作精神、沟通能力；
        2、 具备较好的艺术修养、审美、创新能力以及过硬的摄像技术，
        3、 熟练使用佳能5D Mark 4、索尼PMW-EX280、等摄像器材；
      </pre>
      <div class="company-info-container">
        <div class="info">
          <img class="company-avatar" src="https://img.bosszhipin.com/beijin/upload/com/workfeel/20230128/7bf6f160950405e926523a7a2f65762ff05bf107a7bc2c281659d04846c031ace8be1e47045b27d8.jpg?x-oss-process=image/resize,w_100,limit_0" alt="">
          <div class="detail-info">
            <span>阿里巴巴</span>
            <span><span>阿里巴巴</span>|<span>校招hr</span></span>
          </div>
        </div>
      </div>
    </a-card>
    <div class="aside">
      <salaryCaculate/>
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
import { obj } from '@/types/jobType'
import salaryCaculate from './components/salaryCaculate/index.vue'
import { jobDetailStore } from "@/store/jobDetail";
const router = useRouter();
const route = useRoute();
let isIn = ref(false);
const jobId = route.query.id
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

      .row-first {
        span:first-of-type {
          color: #fff;
          font-size: 22px;
          margin-right: 20px;
        }

        span:last-of-type {
          font-size: 28px;
          color: #f26d49;
        }
      }

      .row-last {
        min-width: 300px;
        height: 40px;

        span {
          display: inline-block;
          min-width: 40px;
          height: 25px;
          background-color: rgba(#fff, 0.5);
          margin-right: 10px;
          text-align: center;
          line-height: 15px;
          padding: 5px;
          color: var(--themeColor);
          font-weight: bold;
          border-radius: 5px;
        }
      }
    }

    .info {
      width: 250px;
      height: 30px;
      margin: 10px 0 10px 40px;

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
      width: 120px;
      height: 50px;
      background-color: transparent;
      color: #fff;
      font-weight: bold;
      border-color: #5620a8;
    }

    .chat {
      margin-left: 20px;
      margin-top: 20px;
      width: 120px;
      height: 50px;
      background-color: #5620a8;
      border: none;
      color: #fff;
      font-weight: bold;
    }
  }
}
.info-container {
  width: 1200px;
  height: 600px;
  margin: 15px auto;
  padding: 20px;
  display: flex;

  .xx-info {
    width: 800px;
    height: 500px;
    border-radius: 15px;

    .ms {
      display: flex;
      justify-content: space-between;

      &>span:first-of-type {
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
        width: 60px;
        height: 40px;
        background-color: #f8f8f8;
        line-height: 40px;
        text-align: center;
        margin-right: 15px;
        border-radius: var(--radiusSize);
        font-weight: bold;
      }
    }

    pre {
      font-family: "Microsoft YaHei UI", serif;
      letter-spacing: 0.1em;
    }

    .company-info-container {
      width: 850px;
      height: 100px;
      position: absolute;
      bottom: 10px;

      .info {
        height: 100px;
        width: 300px;
        display: flex;
        align-items: center;

        .company-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
        }

        .detail-info {
          height: 80px;
          margin-left: 15px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;

          &>span:first-of-type {
            font-size: 20px;
            font-weight: bold;
          }

          &>span:last-of-type {
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
  .aside{
    width: 300px;
    height: 400px;
    margin-left: 20px;
  }
}</style>
