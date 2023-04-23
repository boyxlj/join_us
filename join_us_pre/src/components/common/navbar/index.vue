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
      <ul class="profile" v-if="!loginState">
        <li>上传简历</li>
        <li>我要找工作</li>
        <li>我要招聘</li>
        <div class="loginBtn" @click="navigateLogin">登录/注册</div>
      </ul>
      <ul class="profile profile2" v-else>
        <li>消息</li>
        <li class="line">简历</li>
        <li>上传</li>
        <div class="userProfile" @click.self="$router.push('/home/user/job')">
          <div class="cons">
            <span>{{ users.nickName }}</span>
            <div class="avatar">
              <img :src="users.avatar" alt="" />
            </div>
            <div class="hovers">
              <router-link to="/home/user/profile" class="centers">
                <span class="center_title">个人中心</span>
                <span class="center_others">推荐职位、编辑在线简历</span>
              </router-link>
              <router-link to="#">账号与安全中心</router-link>
              <router-link to="#">隐私保护</router-link>
              <router-link to="#">消息通知</router-link>
              <router-link to="#" class="line">切换为招聘者</router-link>
              <a  class="line" @click.prevent="cancelLogin">退出登录</a>
            </div>
          </div>
        </div>
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
        <li :data-id="item.code" v-for="item in hotCityList" :key="item.code">
          {{ item.name }}
        </li>
      </div>
      <p>其他城市</p>
      <div class="tag" @click="clickCity">
        <li :data-id="item.code" v-for="item in otherCityList" :key="item.code">
          {{ item.name }}
        </li>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { AimOutlined } from "@ant-design/icons-vue";
import { useCity } from "@/store/city";
import { useUserInfo } from "@/store/user";
import { useUserLoginState } from "@/hooks/useUserLoginState";
const visible = ref<boolean>(false);
const useList = useUserInfo();
const loginState = useUserLoginState();
const users = computed(() => useList.userInfo);
const router = useRouter();
const clickLogo = () => {
  router.push("/");
};
const city = useCity();

const hotCityList = computed(() => city.hotCityList);
const positionCity = computed(() => city.preventCity);
const otherCityList = computed(() => city.otherCityList);
const clickCity = (e: any) => {
  if (!e.target.dataset.id) return;
  city.changeCity(e.target.innerText);
  visible.value = false;
};
const changeCity = () => {
  visible.value = true;
};
const navigateLogin = () => {
  router.push("/login");
};

const cancelLogin = (e:Event)=>{
  localStorage.removeItem('token')
  // router.push('/home/index')
  router.go(0)
}
</script>

<style lang="less" scoped>
.navbar {
  widows: 100%;
  height: 54px;
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
    .profile2 {
      margin-left: 100px;

      .line {
        position: relative;
        &::after {
          content: "";
          color: #fff;
          margin: 0;
          font-size: 0;
          width: 1px;
          height: 10px;
          background: #fff;
          border-radius: 1px;
          position: absolute;
          right: -15px;
          top: 52%;
          transform: translateY(-50%);
        }
      }
      .userProfile {
        padding: 3px 10px;
        box-sizing: border-box;
        min-width: 160px;
        height: 50px;
        display: flex;
        position: relative;
        align-items: center;

        &:hover {
          .cons {
            background: #4d4f54;
          }
        }
        .cons {
          padding: 2px 8px;
          width: 100%;
          display: flex;
          border-radius: 5px;
          justify-content: space-between;
          align-items: center;
          transition: all 0.2s linear;
          position: relative;
          cursor: pointer;

          &:hover {
            .hovers {
              display: block;
            }
          }
          .hovers {
            position: absolute;
            width: 130%;
            height: 293px;
            top: 44px;
            border: 1px solid #ddd;
            background: #fff;
            box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.08);
            border: 1px solid #ededed;
            right: 0;
            border-radius: var(--radiusSize);
            display: none;
            z-index: 999;
            padding: 8px 5px;
            box-sizing: border-box;
            overflow: hidden;
            a {
              width: 100%;
              height: 44px;
              display: block;
              line-height: 44px;
              background: #fff;
              border-radius: 4px;
              font-size: 13px;
              color: #222;
              padding: 0 10px 0 14px;
              box-sizing: border-box;
              border-radius: 6px;
              transition: all 0.2s linear;
              
              &:hover {
                color: var(--themeColor);
                background: #f8f8f8;
                font-weight: 500;
                span{
                  color: #999;
                }
                .center_title {
                  color: var(--themeColor);
                }
              }
              overflow: hidden;
            }
            .centers {
              height: 50px;
              display: flex;
              flex-direction: column;
              font-size: 12px;
              color: #999;
              line-height: 17px;
              margin-top: 4px;
              justify-content: center;

              .center_title {
                font-size: 14px;
                color: #222;
              }
              .center_others{
                margin-top: 3px;
              }
            }
            .line {
              position: relative;
              &::after {
                width: 84%;
                top: 0;
                left: 50%;
                transform: translateX(-50%);
                content: "";
                position: absolute;
                height: 1px;
                background-color: #ebedef;
              }
              &:hover {
                color: var(--themeColor);
                background: none;}
            }
          }
          span {
            display: inline-block;
            min-width: 80px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            padding-right: 10px;
            box-sizing: border-box;
          }
          .avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-left: 7px;
            overflow: hidden;
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
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
    user-select: none;
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
      .icon {
        margin-right: 8px;
      }
      &:hover {
        color: #fff;
        border: 1px solid var(--themeColor);
      }
    }
  }
}
</style>
