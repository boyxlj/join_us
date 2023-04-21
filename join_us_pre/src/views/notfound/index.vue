<template>
  <div class="notfound-container">
      <EyeInvisibleTwoTone :style="{ fontSize: '200px' }" two-tone-color="#6c2ca1" />
      <span class="text">
        哦豁，页面找不到了......
      </span>
  </div>
</template>

<script setup lang="ts">
import {
  EyeInvisibleTwoTone,
} from '@ant-design/icons-vue'
</script>

<style lang='less' scoped> 
.notfound-container{
  width: 1000px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  display: flex;
  justify-content: center;
  .text{
    font-size: 50px;
    height: 200px;
    display: inline-flex;
    align-items: center;
    vertical-align: top;
    margin-left: 30px;
    color: #6c2ca1;
  }
}
</style>