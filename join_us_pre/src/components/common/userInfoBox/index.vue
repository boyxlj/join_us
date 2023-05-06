<template>
  <div class="userCard">
    <div class="info">
      <div class="left">
        <img :src="userInfo.avatar" alt="" />
      </div>
      <div class="right">
        <div class="top">{{ userInfo.name }}</div>
        <div class="bottom">
          <span>{{ getAge(userInfo.born) }}岁</span>
          <span v-show="show">{{ userInfo.leave_schoolTime?.split("-")[0] }}年应届生</span>
          <span>{{ userInfo.degree }}</span>
        </div>
      </div>
    </div>
    <div class="btns" @click="$router.push('/home/user/resume')">编辑</div>
    <div class="sendInfo">
      <li @click="$router.push('/home/user/jobs/fromChat?tag=0')">
        <span class="weight">{{ sendNum.sendAllNum }}</span><span>已投递</span>
      </li>
      <li @click="$router.push('/home/user/jobs/fromChat?tag=1')">
        <span class="weight">{{ sendNum.sendErrNum }}</span><span>不合适</span>
      </li>
      <li @click="$router.push('/home/user/jobs/fromChat?tag=2')">
        <span class="weight">{{ sendNum.sendOkNum }}</span><span>面试</span>
      </li>
      <li @click="$router.push('/home/user/jobs/fromChat?tag=3')">
        <span class="weight">{{ sendNum.collectNum }}</span><span>感兴趣</span>
      </li>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAge } from "@/utils/getAge";
import { useUserInfo } from "@/store/user";
import { IUserInfo } from "@/types/userInfo";
withDefaults(defineProps<{show?:boolean}>(),{
  show:true
})
const userStore = useUserInfo();
const sendNum = computed(()=>userStore.sendNum)
const userInfo = computed(
  () => userStore.userInfoList[0]
) as unknown as IUserInfo;
</script>

<style lang="less" scoped>
.userCard {
  width: 100%;
  background: #fff;
  height: 195px;
  margin-bottom: 20px;
  border-radius: var(--radiusSize);
  padding: 10px 20px;
  box-sizing: border-box;
  .info {
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    box-sizing: border-box;
    .left {
      width: 47px;
      height: 47px;
      border-radius: 50%;
      img {
        border-radius: 50%;
        width: 100%;
      }
    }
    .right {
      flex: 1;
      margin-left: 12px;
      .top {
        font-size: 16px;
        color: #222;
      }
      .bottom {
        font-size: 12px;
        color: #666;
        span {
          margin-right: 24px;
          position: relative;
          &::after {
            content: "";
            position: absolute;
            width: 1px;
            height: 12px;
            top: 51%;
            right: -12px;
            transform: translateY(-50%);
            background: #e0e0e0;
          }
          &:last-child {
            &::after {
              display: none;
            }
          }
        }
      }
    }
  }
  .btns {
    width: 100%;
    border-radius: var(--radiusSize);
    cursor: pointer;
    height: 38px;
    margin: 10px auto;
    transition: all 0.2s linear;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #d4d5d6;
    &:hover {
      color: var(--themeColor);
      border: 1px solid var(--themeColor);
    }
  }
  .sendInfo {
    width: 100%;
    height: 50px;
    display: flex;
    background: linear-gradient(90deg, #f5fcfc, #fcfbfa);
    justify-content: space-between;
    li {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      &:hover {
        .weight {
          color: var(--themeColor);
        }
      }
      span {
        font-size: 12px;
        color: #666;
        font-weight: 400;
      }
      .weight {
        font-size: 18px;
        font-family: kanzhun;
        color: #222;
        transition: all 0.1s linear;
      }
    }
  }
}
</style>
