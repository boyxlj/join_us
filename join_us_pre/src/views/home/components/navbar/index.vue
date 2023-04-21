<template>
    <div class="navbar">
      <div class="container">
        <div class="logo">
          <img src="../../../../assets/vue.svg" alt="" />
          <p class="city">
            <span class="weight">武汉</span>
            <span class="changeCity">[切换城市]</span>
          </p>
        </div>
        <ul class="links">
          <router-link to="/home" active-class="homeLinkActive">首页</router-link>
          <router-link to="/" active-class="homeLinkActive">首页</router-link>
          <router-link to="/" active-class="homeLinkActive">首页</router-link>
          <router-link to="/" active-class="homeLinkActive">首页</router-link>
          <router-link to="/" active-class="homeLinkActive">首页</router-link>
          <router-link to="/" active-class="homeLinkActive">首页</router-link>
        </ul>
        <ul class="profile">
          <li>上传简历</li>
          <li>我要找工作</li>
          <li>我要招聘</li>
          <div class="loginBtn" @click="navigateLogin" >登录/注册</div>
        </ul>
      </div>
    </div>
</template>

<script setup lang="ts">
const router = useRouter()
  const navigateLogin = ()=>{
    router.push('/login')
  }
</script>

<style lang='less' scoped> 
.navbar {
    widows: 100%;
    height: 54px;
    background: skyblue;
    background: #202329;
    box-shadow: 0 1px 8px rgba(0,0,0,.06);
    .container {
      width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      color: #fff;
      .logo{
        display: flex;
        align-items: center;
        height: 100%;
      
       p{
        margin: 0;
       }
        .city{
          margin-left: 40px;
          cursor: pointer;
          height: 100%;
          line-height: 54px;

          .weight{
            color: var(--themeColor);
          }
          .changeCity{
            font-size: 12px;
            margin-left: 10px;
          }
        }
      }
      ul{
        margin: 0;
      }
      .links{
        height: 100%;
        line-height: 54px;
        margin: 0 40px;
        a{
          margin: 0 25px;
          color: #fff;
          transition: all .2s;
          &:hover{
            color: var(--themeColor);
          }
        }
        .homeLinkActive{
          color: var(--themeColor);
        }
      }
      .profile {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 40px;
        li{
          margin-right: 28px;
          cursor: pointer;
          transition: all .2s;
          &:hover{
            color: var(--themeColor);
          }
        }
        .loginBtn{
          margin-left:25px;
          border-radius: var(--radiusSize);
          border: 1px solid  var(--themeColor);
          padding: 2px 14px;
          cursor: pointer;
          transition: all .2s;
          &:hover{
            border: 1px solid  var(--themeColor);
            color: var(--themeColor);
            background: #ac9ccb;
          }
        }
      }
    }
  }
</style>