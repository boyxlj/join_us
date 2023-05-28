<template>
  <div class="posDetails" >
    <template v-for="item in positionItem" :key="item.id">
      
    <div class="info">
      <div class="item"><span>职位名称：</span>{{ item.position_name }}</div>
      <div class="item"><span>职位类型：</span>{{ item.job_type }}</div>
      <div class="item"><span>职位分类：</span>{{ dealWithData(item.position_type1) }}-{{
              dealWithData(item.position_type2, item.position_type1)
            }}</div>
      <div class="item"><span>发布城市：</span>{{ item.cityName  }} - {{ item.pos_region }}</div>
      <div class="item"><span>职位薪资：</span>{{ item.salary }}</div>
      <div class="item"><span>经验要求：</span>{{ item.experiences }}</div>
      <div class="item"><span>学历要求：</span>{{ item.degrees }}</div>
      <div class="item"><span>职位福利：</span>
      <template v-if="JSON.parse(item.welfare_tag).length">
        <span class="tagSpan" v-for="(tag,index) in JSON.parse(item.welfare_tag)" :key="index">
          {{ tag }}
          </span>
      </template>
      </div>
      <div class="item"><span>职位状态：</span>
        <a-tag color="success" v-if="item.position_state==='1'">正常</a-tag>
          <a-tag color="warning" v-else-if="item.position_state==='0'">待审核</a-tag>
          <a-tag color="error" v-else-if="item.position_state==='2'">已关闭</a-tag></div>
      <div class="item"><span>发布时间：</span>{{ getTime(item.pos_addTime) }}</div>
      <div class="item" v-if="item.updateTime"><span>更新时间：</span>{{ getTime(item.updateTime) }}</div>
    </div>
    <div class="descs">
      职位描述：<br>
      <pre>{{ item.position_desc }}</pre>
    </div>
    <div class="hr">
      <div class="item"><span>人事头像：</span>
        <a-avatar v-if="item.avatar" :src="item.avatar" size="large">
          </a-avatar>
          <a-avatar v-else size="large">
            <template #icon><UserOutlined /></template>
          </a-avatar></div>
      <div class="item"><span>人事昵称：</span>{{ item.name }}</div>
      <div class="item"><span>人事身份：</span>{{ item.hr_identity }}</div>
      <div class="item"><span>联系方式：</span>{{ item.telephone }}</div>
      <div class="item"><span>注册时间：</span>{{ getTime(item.reg_time) }}</div>
    </div>
  </template>

  </div>
</template>

<script setup lang="ts">
import { UserOutlined} from "@ant-design/icons-vue";

import { IPositionData } from "../../types";
import { useJobTypeStore } from "@/store/positionType";
import {getTime} from "@/utils/formatTime"
const { positionTypeList } = useJobTypeStore();
const props = defineProps<{ positionItem: IPositionData[] }>();

//处理职位分类数据
const dealWithData = (position_value: string,parent?:string) => {
  if(!parent){
    const res: any = positionTypeList.filter(
      (item: any) => item.position_type_id == position_value
    );
    return res[0].position_type_name;
  }else{
    const res: any = positionTypeList.filter(
      (item: any) => item.position_type_id == parent
    );
    if(res.length){
      const res2:any = res[0].children?.filter(
      (item: any) => item.position_type_id == position_value
      );
      return res2[0].type_name;
    }else{
      return ''
    }
  }
};
</script>

<style lang="less" scoped>
.posDetails{
  .info{
    background: #f8f8f8;
    padding: 15px 20px;
    box-sizing:border-box;
    border-radius: var(--radiusSize);
    display: flex;
    flex-wrap: wrap;
    .item{
      margin-right: 60px;
      margin-bottom: 20px;
      font-size: 16px;
      span{
        &:first-child{
          font-weight: 500;
        }
      }
      .tagSpan{
        background: var(--themeColor);
        color: #fff;
        padding: 0px 8px;
        margin-right: 6px;
        border-radius: 4px;
        display: inline-block;
      }
    }
  }
  .descs{
    background: #f8f8f8;
    padding: 15px 20px;
    margin: 20px 0;
    box-sizing:border-box;
    border-radius: var(--radiusSize);
  }
  .hr{
    background: #f8f8f8;
    padding: 15px 20px;
    box-sizing:border-box;
    display: flex;
    flex-wrap: wrap;
    border-radius: var(--radiusSize);
    .item{
      margin-right: 60px;
      margin-bottom: 10px;
      font-size: 16px;
      span{
        &:first-child{
          font-weight: 500;
        }
      }
      }
  }
}


</style>
