<template>
  <div class="index">
    <div class="banner">
      <img src="../../assets/images/banner.jpg" alt="" />
    </div>
    <Search/>
    <div class=""></div>
  </div>
  
</template>

<script setup lang="ts">
import Search from "./components/search/index.vue"
</script>

<style lang="less" scoped>
.index {
  .banner {
    widows: 100%;
    height: 200px;
    img{
      width: 100%;
      height: 100%;
    }
  }
}
</style>
