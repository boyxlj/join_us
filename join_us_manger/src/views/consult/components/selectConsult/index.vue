<template>
  <div class="selectConsult" v-for="item in selectConsultData" :key="item.id
  ">
    <div class="title" >{{ item.title }}</div>
    <div class="info">
      <li class="left">
        <span>分类:</span>
        <a-tag bordered color="pinkpurple" >{{ item.category }}</a-tag>
      </li>
      <li class="right">
        <span class="name" v-if="item.manger_id">{{ item.manger_id }}</span>
        <span class="time" v-if="item.publish_time">{{ getTime(item.publish_time,'time') }}</span>
      </li>
    </div>
    <div class="descs">{{ item.descs }}</div>
    <div class="content"  >
      <div class="editor">
      <MdEditor  previewOnly codeTheme="github" v-model="item.content" />
      </div>
    </div>

    <div class="img" v-if="item.cover_img">
      <img :src="item.cover_img" alt="">
    </div>
    <div class="update" v-if="item.updateTime">最近一次修改时间：{{ item.updateTime }}</div>
  </div>
</template>

<script setup lang="ts">
import { IConsultData } from "@/types/consult";
import {getTime} from "@/utils/formatTime"
import MdEditor from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
defineProps<{selectConsultData:IConsultData[]}>()

</script>

<style lang="less" scoped>
.selectConsult {
  padding: 15px 20px;
  box-sizing: border-box;
  .title {
    font-size: 28px;
    font-weight: 600;
    color: #222;
    line-height: 40px;
  }
  .info {
    font-size: 15px;
    color: #666;
    line-height: 20px;
    display: flex;
    align-items: center;
    margin: 15px 0;
    justify-content: space-between;
    padding-bottom: 10px;
        border-bottom: 1px solid #ededed;
    .left{
      display: flex;
      align-items: center;
      span{
        font-weight: bold;
        margin-right:5px;
      }
    }
    .right{
      .time{
        margin-left: 20px;
      }
    }
  }
  .descs{
    font-size: 15px;
    line-height: 30px;
  }
  .img{
    width: 400px;
    height: 300px;
    border-radius: 10px;
    img{
      width: 100%;
      object-fit: cover;
    }
  }
}


::v-deep(#md-editor-v3-preview-wrapper){
  padding: 0 !important;
  margin: 0;
}

</style>
