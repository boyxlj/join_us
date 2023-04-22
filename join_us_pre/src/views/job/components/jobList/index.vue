<template>
  <div class="jobList" v-for="item in 10" :key="item">
    <div class="top">
      <div class="left">
        <p class="jobName">终端区域经理 [郑州·管城回族区·二里岗]</p>
        <p class="info">
          <b class="salary">20-25k</b>
          <span class="year">3-5年</span>
          <span class="xl">大专</span>
        </p>
      </div>
      <div class="right">
        <div class="right_left">
          <img src="../../../../assets/vue.svg" alt="" />
        </div>
        <div class="right_right">
          <p class="company">河南酒销售有限公司</p>
          <p class="infos">
            <span class="types">食品/饮料/烟酒</span>
            <span class="rz">不需要融资</span>
            <span class="num">1000-9999人</span>
          </p>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="left">
        <span>企业(To B)</span>
        <span>科技医疗</span>
        <span>客户关系维护社群运营</span>
        <span>用户运营互联网</span>
      </div>
      <div class="bottom_right">
        零食下午茶，五险，股票期权，加班补助，绩效奖金，补充医疗保险，包住，节日福绩效奖金，补充医疗
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

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
  }
}
</style>
