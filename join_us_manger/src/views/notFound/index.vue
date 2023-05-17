<template>
  <div class="notFound">
    <div class="img">
      <img src="../../assets/images/404.jpg" alt="">
    </div>

  </div>
</template>

<script setup lang="ts">

</script>

<style lang='less' scoped> 
.notFound{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .img{
    width: 400px;
    height: 200px;
    img{
      width: 100%;
    }
  }
}
</style>