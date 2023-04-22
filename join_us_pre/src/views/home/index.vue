<template>
  <div class="home">
    <NavBar/>
    <router-view></router-view>
    <Footer/>
  </div>
</template>

<script setup lang="ts">
  import NavBar from "@/components/common/navbar/index.vue"
  import Footer from "@/components/common/footer/index.vue"
</script>

<style lang="less" scoped>
.home {
  user-select: none;
}
</style>
