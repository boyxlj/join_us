<template>
  <div class="footer">
      <li class="left" v-if="Copyright">
        Copyright © 2022-{{ new Date().getFullYear() }} join-us All Rights
        Reserved
      </li>
      <li class="ba" v-if="ba">
        备案号:
        <a
          target="_blank"
          href="https://beian.miit.gov.cn/#/Integrated/recordQuery"
          >津ICP备2021007424号-1</a
        >
      </li>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{Copyright?:boolean,ba?:boolean}>(),{
  Copyright:true,
  ba:true,
})

</script>

<style lang="less" scoped>
.footer {
  text-align: center;
  display: flex;
  width:100%;
  height: 80px;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #ddd;
  .ba{
    margin-left: 15px;
    a{
      color: #666;
      transition: all .2s linear;
      &:hover{
        color: var(--themeColor);
      }
    }

  }
}
</style>
