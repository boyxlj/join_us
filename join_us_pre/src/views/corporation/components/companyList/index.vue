<template>
  <div class="listBox">
    <div class="item" @click="navigateCompanyDetail(item.company_id)" v-for="item in companyData" :key="item.id">
      <div class="itemTops">
        <div class="itemTopsLeft"><img v-lazy="item.logo" alt="" /></div>
        <div class="itemTopsRight">
          <p class="comName" >{{ item.company_name }}</p>
          <p class="info">
            <span>{{ item.financing ? item.financing : "不需要融资" }}</span>
            <span v-if="item.industry">{{ item.industry }}</span>
          </p>
        </div>
      </div>
      <div class="itemBottoms">
        <span class="hots">热招</span>
        <span class="posName" @click.stop="navigateJobDetails(item.position_id)">{{ item.position_name }}</span>
        <span class="salary">{{ item.salary }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ICompanyData } from "@/types/company";
defineProps<{ companyData: ICompanyData[] }>();
const navigateJobDetails = (position_id:string)=>{
  window.open(`/#/home/jobDetail?position_id=${position_id}`)
}
const navigateCompanyDetail = (company_id:string)=>{
  window.open(`/#/home/companyDetail?company_id=${company_id}`)
}
</script>

<style lang="less" scoped>
.listBox {
  width: 100%;
  min-height: 300px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  .item {
    width: 287px;
    height: 140px;
    background: #fff;
    border-radius: var(--radiusSize);
    display: flex;
    margin-right: 13px;
    margin-bottom: 18px;
    flex-direction: column;
    justify-content: space-between;
    transition: all 0.2s linear;
    overflow: hidden;
    cursor: pointer;
    &:hover {
      box-shadow: 0 16px 40px 0 hsla(0, 0%, 60%, 0.3);
    }
    p {
      margin: 0;
    }
    .itemTops {
      height: 76px;
      padding: 20px 20px 0;
      display: flex;

      .itemTopsLeft {
        height: 55px;
        width: 60px;
        margin-right: 13px;
        border-radius: 10px;
        border: solid 1px #f2f5fa;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .itemTopsRight {
        width: 181px;
        .comName {
          font-size: 16px;
          line-height: 30px;
          color: #222;
          margin-top: -5px;
          max-width: 181px;
          white-space: nowrap;
          margin-right: 7px;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: all 0.2s linear;
          cursor: pointer;
          &:hover {
            color: var(--themeColor);
          }
        }
        .info {
          margin-top: 6px;
          span {
            display: inline-block;
            color: #666;
            padding: 0 4px;
            background: #f8f8f8;
            font-size: 13px;
            border-radius: 4px;
            max-width: 88px;
            white-space: nowrap;
            margin-right: 7px;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 22px;
          }
        }
      }
    }
    .itemBottoms {
      height: 47px;
      background: linear-gradient(90deg, #f5fcfc, #fcfbfa);
      display: flex;
      align-items: center;
      span {
        font-size: 13px;
        color: #666;
      }
      .hots {
        display: inline-block;
        margin: 0 20px 0 28px;
        position: relative;
        &::after {
          content: "";
          width: 1px;
          height: 13px;
          background: #cccccc;
          position: absolute;
          top: 50%;
          right: -10px;
          transform: translateY(-50%);
        }
      }
      .posName {
        color: var(--themeColor);
        cursor: pointer;
        display: inline-block;
        max-width: 110px;
        white-space: nowrap;
        margin-right: 15px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
     
    }
  }
}
</style>
