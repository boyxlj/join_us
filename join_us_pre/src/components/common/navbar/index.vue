<template>
  <div class="navbar">
    <div class="container">
      <div class="logo">
        <img @click="clickLogo" src="../../../assets/vue.svg" alt="" />
        <p class="city" @click="changeCity">
          <span class="weight">{{ positionCity }}</span>
          <span class="changeCity">[切换城市]</span>
        </p>
      </div>
      <ul class="links">
        <router-link to="/home/index" active-class="homeLinkActive"
          >首页</router-link
        >
        <router-link to="/home/job" active-class="homeLinkActive"
          >职位</router-link
        >
        <router-link to="/" active-class="homeLinkActive">首页</router-link>
        <router-link to="/" active-class="homeLinkActive">首页</router-link>
        <router-link to="/" active-class="homeLinkActive">首页</router-link>
        <router-link to="/" active-class="homeLinkActive">首页</router-link>
      </ul>
      <ul class="profile">
        <li>上传简历</li>
        <li>我要找工作</li>
        <li>我要招聘</li>
        <div class="loginBtn" @click="navigateLogin">登录/注册</div>
      </ul>
    </div>
    <a-modal
      class="cityChange"
      v-model:visible="visible"
      :footer="null"
      centered
      title="城市选择"
      :width="700"
    >
      <p>当前选择城市</p>
      <div class="tag prevent">
        <li><aim-outlined class="icon" />{{ positionCity }}</li>
      </div>
      <p>热门城市</p>
      <div class="tag" @click="clickCity">
        <li v-for="item in hotCityList" :key="item.code">{{ item.name }}</li>
      </div>
      <p>其他城市</p>
      <div class="tag" @click="clickCity">
        <li v-for="item in otherCityList" :key="item.code">{{ item.name }}</li>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import {AimOutlined} from '@ant-design/icons-vue';
import {hotCityList} from "@/utils/hotCity"
import {otherCityList} from "@/utils/otherCity"
const visible = ref<boolean>(false);
const positionCity = ref('武汉')
const router = useRouter()
const clickLogo = ()=>{
  router.push('/')
}

const clickCity = (e:any)=>{
  positionCity.value = e.target.innerText
  visible.value = false

}
const changeCity = () => {
  visible.value = true;
};
const navigateLogin = () => {
  router.push("/login");
};
</script>

<style lang="less" scoped>
.navbar {
  widows: 100%;
  height: 54px;
  background: skyblue;
  background: #202329;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.06);
  user-select: none;
  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: #fff;
    .logo {
      display: flex;
      align-items: center;
      height: 100%;

      p {
        margin: 0;
      }
      .city {
        margin-left: 40px;
        cursor: pointer;
        height: 100%;
        line-height: 54px;

        .weight {
          color: var(--themeColor);
        }
        .changeCity {
          font-size: 12px;
          margin-left: 10px;
        }
      }
    }
    ul {
      margin: 0;
    }
    .links {
      height: 100%;
      line-height: 54px;
      margin: 0 40px;
      a {
        margin: 0 25px;
        color: #fff;
        transition: all 0.2s;
        &:hover {
          color: var(--themeColor);
        }
      }
      .homeLinkActive {
        color: var(--themeColor);
      }
    }
    .profile {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 40px;
      li {
        margin-right: 28px;
        cursor: pointer;
        transition: all 0.2s;
        &:hover {
          color: var(--themeColor);
        }
      }
      .loginBtn {
        margin-left: 25px;
        border-radius: var(--radiusSize);
        border: 1px solid var(--themeColor);
        padding: 2px 14px;
        cursor: pointer;
        transition: all 0.2s;
        &:hover {
          border: 1px solid var(--themeColor);
          color: var(--themeColor);
          background: #ac9ccb;
        }
      }
    }
  }
}
.cityChange {
  height: 60vh;
  p {
    font-size: 16px;
    font-weight: 500;
    color: #222;
    line-height: 22px;
  }
  .tag {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    li {
      display: inline-block;
      margin: 0 9px 16px 8px;
      box-sizing: border-box;
      min-width: 90px;
      height: 32px;
      border-radius: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #d4d5d6;
      cursor: pointer;
      user-select: none;
      transition: all 0.3s linear;
      &:hover {
        color: var(--themeColor);
        border: 1px solid var(--themeColor);
      }
    }
  }
  .prevent {
    li {
      color: #fff;
      background: var(--themeColor);
      .icon{
        margin-right: 8px;
      }
      &:hover{
        color: #fff;
        border: 1px solid var(--themeColor);
      }
    }
  }
}
</style>
