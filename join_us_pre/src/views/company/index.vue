<template>
  <div class="companyPage">

  <a-layout class="loyOut">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="title" v-if="!collapsed"><span>招聘</span>企业版</div>
      <div class="title" v-else>企业版</div>
      <div class="logo" />
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="1">
          <user-outlined />
          <span>nav 1</span>
        </a-menu-item>
        <a-menu-item key="2">
          <video-camera-outlined />
          <span>nav 2</span>
        </a-menu-item>
        <a-menu-item key="3">
          <upload-outlined />
          <span>nav 3</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <menu-unfold-outlined
          v-if="collapsed"
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
      </a-layout-header>
      <a-layout-content
        :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }"
      >
        Content
      </a-layout-content>
    </a-layout>
  </a-layout>
</div>

</template>

<script setup lang="ts">
import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons-vue';
const selectedKeys =  ref<string[]>(['1'])
 const collapsed= ref<boolean>(false)

 const menuList = ref([
  {id:0,name:'数据分析'},
  {id:1,name:'职位管理'},
  {id:2,name:'搜索牛人'},
  {id:3,name:'沟通'},
  {id:6,name:'公司'},
  {id:4,name:'工具箱'},
  {id:5,name:'更多'},
 ])
</script>

<style lang='less' scoped> 
.ant-layout{
  height: 100vh !important;
  .ant-layout-header{
    padding: 0 20px !important;
  }
  .title{
    color: #fff;
    height: 64px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--themeColor);
    font-weight: 500;
    font-size: 16px;
    span{
      font-size: 18px;

    }
  }
}

#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  margin: 16px;
}

.site-layout .site-layout-background {
  background: #fff;
}
</style>