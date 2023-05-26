<template>
  <div class="statistics">
    <div class="hr_info">欢迎回来！{{ hr_name.name || "" }}</div>
    <div class="list">
      <div class="items">
        <div class="icon"><MedicineBoxOutlined class="iconCon" /></div>
        <div class="info">
          <p class="info_title">您已发布职位 / 公司</p>
          <p class="num">
            <AnimatedNumber :duration="timer" v-if="data.position_total" :from="0" :to="data.position_total" />
            <span v-else>0</span>
            <span class="lines">/</span>
            <AnimatedNumber :duration="timer" v-if="data.companyPosition_total" :from="0" :to="data.companyPosition_total" />
            <span v-else>0</span>
          </p>
        </div>
      </div>
      <div class="items">
        <div class="icon"><AntDesignOutlined class="iconCon" /></div>
        <div class="info">
          <p class="info_title">当前公司人事总数</p>
          <p class="num"><AnimatedNumber :duration="timer" v-if="data.hr_total" :from="0" :to="data.hr_total" />
            <span v-else>0</span>
            </p>
        </div>
      </div>
      <div class="items">
        <div class="icon"><FileDoneOutlined class="iconCon" /></div>
        <div class="info">
          <p class="info_title">您共收到简历数量 / 公司</p>
          <p class="num">
            <AnimatedNumber :duration="timer" v-if="data.send_total" :from="0" :to="data.send_total" />
            <span v-else>0</span>
            <span class="lines">/</span>
            <AnimatedNumber :duration="timer" v-if="data.companySend_total" :from="0" :to="data.companySend_total" />
            <span v-else>0</span>
             </p>
        </div>
      </div>
      <div class="items">
        <div class="icon"><FundOutlined class="iconCon" /></div>
        <div class="info">
          <p class="info_title">您今日收到简历数量 / 公司</p>
          <p class="num"><AnimatedNumber  :duration="timer" v-if="data.todaySend_total" :from="0" :to="data.todaySend_total" />
            <span v-else>0</span>
            <span class="lines">/</span>
            <AnimatedNumber :duration="timer" v-if="data.companyTodaySend_total" :from="0" :to="data.companyTodaySend_total" />
            <span v-else>0</span>
          </p>
        </div>
      </div>
    </div>
    <div class="echarts">
      <div class="degree">
        <DegreeCom :companyDegreeRes='data.companyDegreesData' :degreeRes="data.degreesData" />
      </div>
      <div class="send">
        <SendCom :companySendRes='data.companySendData' :sendRes="data.sendData" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MedicineBoxOutlined,
  AntDesignOutlined,
  FileDoneOutlined,
  FundOutlined
} from "@ant-design/icons-vue";
import { getStatistics } from "@/api";
import { IStatistics } from "@/types/statistics";
import { IHrData } from "@/types/hr";
import { useCompanyInfo } from "@/store/company_hr";
import { useHrInfo } from "@/store/hr";
import DegreeCom from "./components/degreeCom/index.vue";
import SendCom from "./components/sendCom/index.vue";
const { company_id } = useCompanyInfo();
const { hr_id } = useHrInfo();
const timer = 400
const hr_name = computed(() => useHrInfo().hrInfoList[0] as IHrData);
onMounted(() => {
  getData();
});
const data = reactive<IStatistics>({
  degreesData: [],
  sendData: [],
  companyDegreesData: [],
  companySendData: [],
  todaySend_total: 0,
  position_total: 0,
  send_total: 0,
  hr_total: 0, //人事总数量
  companyTodaySend_total:0,
  companyPosition_total:0,
  companySend_total:0,
});
const getData = async () => {
  const res: any = await getStatistics({company_id,hr_id});
  if (res.code == 200) {
    data.degreesData = res.degreesData;
    data.companyDegreesData = res.companyDegreesData;
    data.companySendData = res.companySendData;
    data.sendData = res.sendData;
    data.todaySend_total = res.todaySend_total;
    data.position_total = res.position_total;
    data.send_total = res.send_total;
    data.hr_total = res.hr_total;
    data.companyTodaySend_total = res.companyTodaySend_total;
    data.companyPosition_total = res.companyPosition_total;
    data.companySend_total = res.companySend_total;
  }
};
</script>

<style lang="less" scoped>
.statistics {
  .hr_info {
    font-size: 20px;
    line-height: 1.4;
    font-weight: 500;
  }
  .list {
    width: 100%;
    height: 100px;
    margin: 25px 0 0;
    display: flex;
    justify-content: space-between;
    .items {
      width: 24%;
      height: 100%;
      padding: 15px 22px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      border: 1px solid #ddd;
      border-radius: var(--radiusSize);
      transition: all 0.2s linear;
      &:hover {
        border: 1px solid #fff;
        box-shadow: 0 0 10px #ddd;
        cursor: pointer;
      }
      .icon {
        width: 58px;
        height: 58px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 25px;
        background: #f2f1f3;
        margin-right: 14px;
        .iconCon{
          color: red;
          animation: iconComDong 4s infinite linear;
        }

      }
      .info {
        
        p {
          margin: 0;
        }
        
        .info_title {
          width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #4e5969;
          font-size: 15px;
        }
        .num {
          display: flex;
          font-size: 26px;
          color: #1d2129;
          font-size: 500;
          align-items: center;
          .lines{
          margin: 0 10px;
          font-size: 18px;
        }
        }
      }
    }
  }
  .echarts{
    display: flex;
    margin-top: 90px;
    .degree{
      position: relative;
    }
    .send{
      position: relative;
      margin-left: 60px;
    }
  }
}
@keyframes iconComDong {
  0%{
    color: rgb(220, 77, 77);
  }
  25%{
    color: rgb(55, 161, 28);
  }
  50%{
    color: rgb(58, 167, 197);
  }
  75%{
    color: rgb(85, 71, 231);
  }
  100%{
    color: rgb(178, 71, 178);
  }
}


</style>
