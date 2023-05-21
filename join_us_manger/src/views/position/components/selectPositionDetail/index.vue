<template>
  <div class="selectPosition" v-if="selectPositionData.length">
    <div
      class="content"
      v-for="(item, index) in selectPositionData"
      :key="index"
    >
      <div class="posBaseInfo">
        <li><span>职位名称：</span>{{item.position_name || '/'}}</li>
        <li><span>所属行业：</span>{{item.industry || '/'}}</li>
        <li><span>工作城市：</span>{{item.cityName }} {{ item.pos_region?' · '+item.pos_region:'' }} </li>
        <li><span>职位类型：</span><a-tag color="purple">{{item.job_type||'不限' }}</a-tag></li>
        <li><span>工作经验：</span>{{item.experiences || '/'}}</li>
        <li><span>学历：</span>{{item.degrees || '/'}}</li>
        <li><span>薪资：</span>{{item.salary || '/'}}</li>
        <li><span>所属公司：</span>{{item.company_name || '/'}}</li>
        <li><span>公司规模：</span>{{item.people_num || '/'}}</li>
        <li><span>岗位发布时间：</span>{{getTime(item.pos_addTime) || '/'}}</li>
        <li v-if="item.updateTime"><span>修改时间：</span>{{getTime(item.updateTime) || '/'}}</li>
      </div>
      <div class="details" v-if="item.position_desc ">
        <div class="titles">岗位职责/招聘要求</div>
        <div class="con">
          <pre>{{ item.position_desc }}</pre>
        </div>
      </div>
      <div class="details" v-if="JSON.parse(item.welfare_tag)?.length">
        <div class="titles">福利待遇</div>
        <div class="con">
          <span v-for="(items,index) in JSON.parse(item?.welfare_tag )" :key="index">{{items}}</span>
        </div>
      </div>
      <div class="details" v-if="item.work_time ">
        <div class="titles">工作时间</div>
        <div class="con">
          <p>{{item.work_time}}</p>
        </div>
      </div>
      <div class="details" v-if="item.rest ">
        <div class="titles">其他</div>
        <div class="con">
          <p>{{item.rest}}</p>
        </div>
      </div>
      <div class="company">
        <div class="logo">
          <img src="" alt="">
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IPositionData } from "@/types/position";
import {getTime} from "@/utils/formatTime"
const props = defineProps<{ selectPositionData: IPositionData[] }>();

</script>

<style lang="less" scoped>
.selectPosition{
  padding: 0 10px;
  box-sizing: border-box;
  .content{
    
    .posBaseInfo{
      width: 100%;
      min-height: 100px;
      border-radius: 10px;
      background: #f3f3f3;
      display: flex;
      justify-content:flex-start;
      flex-wrap: wrap;
      padding:  18px;
      box-sizing:border-box;
      li{
        min-width: 180px;
        span{
          // font-weight: bold;
          margin-right: 8px;
        }
        margin-right: 40px;
        margin-bottom: 20px;
      }
     
    }
    .details{
      margin-top: 25px;
      min-height: 100px;
      .titles{
        font-weight: bold;
        text-align: left;
        font-size: 16px;
      }
      .con{
          padding: 0 15px;
          box-sizing:border-box;
          display: flex;
          flex-wrap: wrap;
          span{
            display: inline-block;
            padding: 2px 10px;
            margin-right: 14px;
            margin-top: 10px;
            background: #f3f3f3;
          }
        }
    }
  }

}
</style>
