<template>
  <div class="list">
    <div class="item" v-for="item in consultData" :key="item.id">
      <div class="left"  @click="navigateConsultDetail(item.consult_id)">
        <img v-if="item.cover_img" :src="item.cover_img" alt="" />
        <img v-else src="../../../../assets/images/consult.jpg" alt="" />
      </div>
      <div class="right">
        <div class="title" @click="navigateConsultDetail(item.consult_id)"><span>{{ item.title }}</span></div>
        <div class="desc">{{ item.descs }}</div>
        <div class="other">
          <li>
            <span class="category">{{ item.category }}</span>
          </li>
          <li>
            <span class="auth">{{ item.manger_id }}</span>
            <span class="time">{{ getTime(item.publish_time) }}</span>
          </li>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {IConsultData} from "@/types/consult"
import {getTime} from "@/utils/formatTime"

  defineProps<{consultData:IConsultData[]}>()
  const navigateConsultDetail =(consult_id:string)=>{
    window.open(`/home/consultDetail?consult_id=${consult_id}`)
  }
</script>

<style lang="less" scoped>
.list {
  .item {
    width: 100%;
    height: 180px;
    background: #fff;
    margin-bottom: 25px;
    border-radius: 10px;
    padding: 15px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all .2s linear;
    &:hover{
      box-shadow: 0 16px 40px 0 rgba(153,153,153,.3);
    }
    .left {
      display: block;
      width: 240px;
      height: 145px;
      overflow: hidden;
      border-radius: 8px;
      border: 1px solid #f2f5fa;
      overflow: hidden;
      cursor: pointer;
      img{
        border-radius: 8px;
        transition: all .2s linear;
        width: 100%;
        height: 100%;
        object-fit: cover;
        &:hover{
          transform: scale(1.1);
        }
      }
    }
    .right {
      flex: 1;
      margin-left: 20px;
      .title {
        font-size: 18px;
        font-weight: 500;
        color: #222;
        line-height: 25px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
        span{
          transition: all .2s linear;
          &:hover{
            color: var(--themeColor);
          }
        }
      }
      .desc {
        font-size: 14px;
        line-height: 24px;
        min-height: 48px;
        color: #666;
        padding: 17px 0 0;
        margin-bottom: 35px;
        overflow: hidden;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .other{
        display: flex;
        justify-content: space-between;
        align-items: center;
        li{
          color: #666;
          .time{
            margin-left: 20px;
          }
        }
      }
    }
  }
}
</style>
