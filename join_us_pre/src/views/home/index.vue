<template>
  <div class="home">
    <NavBar/>
    <router-view></router-view>
    <HotJOb/>
    <Footer/>
  </div>
</template>

<script setup lang="ts">
  import NavBar from "./components/navbar/index.vue"
  import Footer from "./components/footer/index.vue"
</script>

<style lang="less" scoped>
.home {
  user-select: none;
}
</style>
