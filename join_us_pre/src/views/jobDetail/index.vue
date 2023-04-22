<template>
  <div class="detail-header">
    <div class="info-title">
      <div class="name-salary-row">
        <div class="row-first">
          <span>{{ jobInfo.jobName }}</span>
          <span>{{ jobInfo.salary }}</span>
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
        <EnvironmentOutlined :style="{ fontSize: '20px', color: '#fff' }"/>
        <span>{{ jobInfo.place }}</span>
        <ShoppingOutlined :style="{ fontSize: '20px', color: '#fff' }" />
        <span>{{ jobInfo.worktime }}</span>
        <BankOutlined :style="{ fontSize: '20px', color: '#fff' }"/>
        <span>{{ jobInfo.education }}</span>
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
      <pre>需要本科学历
我们提供：
1、国内领先的在线教育企业
2、入职即缴纳五险一金
3、双休，按照国家法定节假日休假
任职要求：
1、 具备极强的责任心、协作精神、沟通能力；
2、 具备较好的艺术修养、审美、创新能力以及过硬的摄像技术，
3、 熟练使用佳能5D Mark 4、索尼PMW-EX280、等摄像器材；
      </pre>
      <template #actions>
        111
      </template>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { ShoppingOutlined, WarningOutlined, EnvironmentOutlined, BankOutlined, StarOutlined, StarFilled } from '@ant-design/icons-vue'
import { jobDetailStore } from '@/store/jobDetail'
const router = useRouter()
const currentRouter = computed(() => router.currentRoute.value)
const jobId = computed(() => currentRouter.value.query.id)
const job = jobDetailStore()
let jobInfo: any
jobInfo = job.allJobList.filter((item: any) => item.id === jobId.value)[0]
let isIn = ref(false)
</script>

<style lang="less" scoped>
.detail-header{
  width: 100%;
  height: 200px;
  background-color: #38556b;
  .info-title{
    width: 1200px;
    height: 200px;
    margin: 0 auto;
    padding-top: 20px;
    .name-salary-row{
      width: 1200px;
      height: 40px;
      display: flex;
      justify-content: space-between;
      padding-left: 40px;
      .row-first{
        span:first-of-type{
          color: #fff;
          font-size: 22px;
          margin-right: 20px;
        }
        span:last-of-type{
          font-size: 28px;
          color: #f26d49;
        }
      }
      .row-last{
        min-width: 300px;
        height: 40px;
        span{
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
    .info{
      width: 250px;
      height: 30px;
      margin: 10px 0 10px 40px;
      span{
        display: inline-block;
        height: 30px;
        line-height: 30px;
        vertical-align: middle;
        margin: 0 3px;
        color: #fff;
      }
    }
    .gxq{
      margin-left: 40px;
      margin-top: 20px;
      width: 120px;
      height: 50px;
      background-color: transparent;
      color: #fff;
      font-weight: bold;
      border-color: #5620a8;
    }
    .chat{
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
.info-container{
  width: 1200px;
  height: 600px;
  margin: 15px auto;
  padding: 20px;
  .xx-info{
    width: 900px;
    height: 500px;
    .ms{
      display: flex;
      justify-content: space-between;
      &>span:first-of-type{
        font-size: 24px;
        font-weight: bold;
      }
    }
    .mark{
      width: 100%;
      height: 40px;
      margin: 15px 0;
      span{
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
    pre{
      font-family: "Microsoft YaHei UI",serif;
      letter-spacing: 0.1em;
    }
  }
}
</style>
