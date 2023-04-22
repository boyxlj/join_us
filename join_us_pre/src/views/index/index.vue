<template>
  <div class="index">
    <div class="banner">
      <img src="../../assets/images/banner.jpg" alt="" />
    </div>
    <div class="content">
      <Search />
      <div class="topKey">
        <span>热搜职位：</span>
        <li>Java</li>
        <li>Python</li>
        <li>Android</li>
        <li>运维工程师</li>
        <li>IT技术支持</li>
        <li>前端开发工程师</li>
      </div>
      <Swiper />
      <HotJOb />
    </div>
    <div class="active animate__animated animate__fadeInDown" :style="{display: showNavBar?'block':'none'}">
      <NavBar />
      <div class="searchBar"  >
        <Search :center="false" :height="80" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import NavBar from "@/views/home/components/navbar/index.vue";
import Search from "./components/search/index.vue";
import Swiper from "./components/swiper/index.vue";
import HotJOb from "./components/hotjob/index.vue";
const showNavBar = ref(false)
onMounted(() => {
  window.addEventListener("scroll", getScrollTop);
});
onUnmounted(() => {
  window.removeEventListener("scroll", getScrollTop);
});

const getScrollTop = () => {
  const val =  document.documentElement.scrollTop;
  console.log(document.documentElement.scrollTop)
  if(val>=300){
    showNavBar.value = true
  }else{
    showNavBar.value = false
  }
};
</script>

<style lang="less" scoped>
.active {
  width: 100%;
  height: 160px;
  background: #fff;
  z-index: 999;
  box-shadow: 0 16px 40px 0 rgba(158, 158, 158, 0.2);
  position: fixed;
  top: 0;
  display: none;
  .searchBar {
    width: 1140px;
    margin: 10px auto;
  }
}
.index {
  .banner {
    width: 100%;
    height: 200px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .content {
    width: 1200px;
    margin: 0 auto;
    .topKey {
      width: 75%;
      display: flex;
      margin: -15px auto 30px;
      li {
        background: #fff;
        color: var(--themeColor);
        margin: 0 12px;
        border-radius: 4px;
        transition: all 0.2s;
        cursor: pointer;
        padding: 1px 5px;
        &:hover {
          color: #fff;
          background: var(--themeColor);
        }
      }
    }
  }
}
</style>
