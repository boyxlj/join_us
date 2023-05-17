<template>
  <div class="userInfoDetail" v-if="itemUserInfo.length" >
    <div class="baseInfo" v-for="item in itemUserInfo" :key="item.id" >
      <div class="avatar">
        <a-avatar :size="74" v-if="item.avatar" :imageUrl="item.avatar"></a-avatar>
            <a-avatar v-else>
              <IconUser />
            </a-avatar>
      </div>
      <li><span>姓名(昵称)：</span>{{item.name || '未设置姓名(昵称)'}}</li>
      <li><span>性别：</span>{{item.gender=='0'?'男':'女'}}</li>
      <li><span>年龄：</span>{{item.born? getAge(item.born) +'岁':'/'}}</li>
      <li><span>出生日期：</span>{{ item.born || '/' }}</li>
      <li><span>邮箱：</span>{{ item.email || '/' }}</li>
      <li><span>手机号：</span>{{ item.phone || '/' }}</li>
      <li><span>住址：</span>{{ item.address || '/' }}</li>
      <li><span>毕业院校：</span>{{ item.school || '/' }}</li>
      <li><span>学历：</span>{{ item.degree || '/' }}</li>
      <li><span>注册时间：</span>{{item.reg_time?getTime(item.reg_time,'time'):'/' }}</li>
      <li><span>账号状态：</span>
        <a-tag color="green" v-if="item.userState=='1'">正常</a-tag>
        <a-tag color="red" v-else>异常</a-tag>
      </li>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconUser } from "@arco-design/web-vue/es/icon";
import { IUserInfoData } from "@/types/userInfo";
import {getAge} from "@/utils/getAge"
import {getTime} from "@/utils/formatTime"
defineProps<{itemUserInfo:IUserInfoData[]}>()

</script>

<style lang='less' scoped> 
.userInfoDetail{
  padding:0 20px;
  box-sizing: border-box;
  .baseInfo{
    position: relative;
    li{
      margin-bottom: 15px;
      span{
        margin-right: 8px;
        font-weight: bold;
      }
    }
    .avatar{
      position: absolute;
      right: 30px;
      top: 10px;
    }
  }
}
</style>