<template>
  <div class="index">
    <div class="banner">
      <img src="../../assets/images/banner.jpg" alt="" />
    </div>
    <div class="content">
      <Search />
      <Swiper />
      <HotJOb />
    </div>
  </div>
</template>

<script setup lang="ts">
import Search from "./components/search/index.vue";
import Swiper from "./components/swiper/index.vue";
import HotJOb from './components/hotjob/index.vue'
</script>

<style lang="less" scoped>
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
  }
}
</style>
