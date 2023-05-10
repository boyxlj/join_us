<template>
  <a-layout class="layout-demo">
    <a-layout-sider hide-trigger collapsible :collapsed="collapsed">
      <div class="logo" v-if="!collapsed">招聘后台管理</div>
      <div class="logo" v-else>聘</div>
      <a-menu
        :defaultOpenKeys="['consult']"
        :defaultSelectedKeys="['consult']"
        :style="{ width: '100%' }"
        @menuItemClick="onClickMenuItem"
      >
        <template v-for="(item,index) in asideList" :key="index">
          <a-menu-item v-if="!item.children" :key="item.path">
            <component :is="item.icon"></component>
            {{ item.name }}
          </a-menu-item>
          <a-sub-menu v-else >
            <template #icon><component :is="item.icon"></component></template>
            <template #title>{{ item.name }}</template>
            <a-menu-item v-for="sub in  item.children" :key="sub.path">
              <component :is="item.icon"></component>
              {{ sub.name}}</a-menu-item>
          </a-sub-menu>
        </template>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="padding-left: 20px">
        <a-button shape="round" @click="onCollapse">
          <IconCaretRight v-if="collapsed" />
          <IconCaretLeft v-else />
        </a-button>
      </a-layout-header>
      <a-layout style="padding: 0 24px">
        <a-breadcrumb :style="{ margin: '16px 0' }">
          <a-breadcrumb-item>Home</a-breadcrumb-item>
          <a-breadcrumb-item>List</a-breadcrumb-item>
          <a-breadcrumb-item>App</a-breadcrumb-item>
        </a-breadcrumb>
        <a-layout-content>
          <router-view></router-view>
        </a-layout-content>
        <a-layout-footer>Copyright © 2022-{{ new Date().getFullYear() }}  join-us  All Rights Reserved</a-layout-footer>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { Message } from "@arco-design/web-vue";
import {
  IconCaretRight,
  IconCaretLeft,
  IconHome,
  IconCalendar,
} from "@arco-design/web-vue/es/icon";
const router = useRouter()
type TAside = {
  path: string;
  icon: any;
  name: string;
  children?: TAside[];
};
const asideList: TAside[] = [
  { path: "consult", name: "咨讯百科", icon: IconHome },
  {
    path: "666",
    name: "职位管理",
    icon: IconCalendar,
    children: [
      { path: "jobList", name: "职位列表", icon: "" },
      { path: "123", name: "职位列表11", icon: "" },
      { path: "456", name: "职位列表22", icon: "" },
    ],
  },
];

const collapsed = ref(false);
const onCollapse = () => {
  collapsed.value = !collapsed.value;
};
const onClickMenuItem = (key,all) => {
  router.push("/"+key)
  Message.info({ content: `You select ${key}`, showIcon: true });
};
</script>

<style lang="less" scoped>
.layout-demo {
  height: 100vh;
  background: var(--color-fill-2);
  border: 1px solid var(--color-border);
  box-sizing: border-box;
}
.layout-demo :deep(.arco-layout-sider) .logo {
  height: 32px;
  margin: 12px 8px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
}
.layout-demo :deep(.arco-layout-sider-light) .logo {
  background: var(--color-fill-2);
}
.layout-demo :deep(.arco-layout-header) {
  height: 64px;
  line-height: 64px;
  background: var(--color-bg-3);
}
.layout-demo :deep(.arco-layout-footer) {
  height: 48px;
  color: var(--color-text-2);
  font-weight: 400;
  font-size: 14px;
  line-height: 48px;
}
.layout-demo :deep(.arco-layout-content) {
  color: var(--color-text-1) !important;
  font-weight: 400;
  font-size: 14px;
  background: var(--color-bg-3);
}
.layout-demo :deep(.arco-layout-footer),
.layout-demo :deep(.arco-layout-content) {
  padding: 15px;
  box-sizing: border-box;

  color: var(--color-white);
  font-size: 16px;
  
}
.layout-demo :deep(.arco-layout-footer){
  color: #666;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-stretch: condensed;
  text-align: center;
}

</style>
