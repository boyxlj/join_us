<template>
  <div class="index">
    <div class="banner">
      <img src="../../assets/images/banner.jpg" alt="" />
    </div>
    <div class="content">
      <Search />
      <div class="topKey">
        <div class="left">
        <span>热搜职位：</span>
        </div>
        <div class="right">
        <li @click="navigateJob(item)" v-for="item in hotSearchPositionList" :key="item">{{item  }}</li>
        </div>
      </div>
      <Swiper />
      <HotJOb />
      <specialJob />
    </div>
    <div id="active" class=" animate__animated animate__fadeInDown" :style="{display: showNavBar?'block':'none'}">
      <NavBar />
      <div class="searchBar"  >
        <Search :center="false" :height="80" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import NavBar from "@/components/common/navbar/index.vue";
import Search from "@/components/common/search/index.vue";
import Swiper from "./components/swiper/index.vue";
import HotJOb from "./components/hotjob/index.vue";
import specialJob from './components/specialJob/index.vue';
import {useHotSearchPosition} from "@/store/position"
const showNavBar = ref(false)
const router = useRouter()
const hotSearchPositionList = computed(()=>useHotSearchPosition().hotSearchPositionList)
const navigateJob  = (val:string)=>{
  router.push(`/home/job?keyword=${val}`);
}
onMounted(() => {
  window.addEventListener("scroll", getScrollTop);
});
onUnmounted(() => {
  window.removeEventListener("scroll", getScrollTop);
});

const getScrollTop = () => {
  const val =  document.documentElement.scrollTop;
  if(val>=300){
    showNavBar.value = true
  }else{
    showNavBar.value = false
  }
};
</script>

<style lang="less" scoped>
@import "@/assets/css/common.less" ;

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
      justify-content: flex-start;
      margin: -15px auto 6px;
      .left{
        width: 70px;
      }
      .right{
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
      }
      li {
        background: #fff;
        color: var(--themeColor);
        margin: 0 12px;
        
        border-radius: 4px;
        transition: all 0.2s;
        justify-content: flex-start;
        margin-bottom: 15px;
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
