<template>
  <a-layout class="layout-demo">
    <a-layout-sider hide-trigger collapsible :collapsed="collapsed">
      <div class="logo" v-if="!collapsed">招聘后台管理</div>
      <div class="logo" v-else>聘</div>
      <a-menu
        :defaultOpenKeys="defaultOpenKeys"
        :defaultSelectedKeys="defaultSelectedKeys"
        :style="{ width: '100%' }"
        @menuItemClick="onClickMenuItem"
      >
        <template v-for="(item, index) in asideData" :key="index">
          <a-menu-item v-if="!item.children" :key="item.path">
            <component :is="item.icon"></component>
            {{ item.name }}
          </a-menu-item>
          <a-sub-menu v-else :key="item.path + ''">
            <template #icon><component :is="item.icon"></component></template>
            <template #title>{{ item.name }}</template>
            <a-menu-item v-for="sub in item.children" :key="sub.path">
              <component :is="sub.icon"></component>
              {{ sub.name }}</a-menu-item
            >
          </a-sub-menu>
        </template>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="header" style="padding-left: 20px">
        <a-button shape="round" @click="onCollapse">
          <IconCaretRight v-if="collapsed" />
          <IconCaretLeft v-else />
        </a-button>
        <a-dropdown trigger="hover">
          <div class="mangerInfo">
            <a-avatar
              v-if="mangerInfo.avatar"
              :imageUrl="mangerInfo.avatar"
            ></a-avatar>
            <a-avatar v-else>
              <IconUser />
            </a-avatar>
            <span>{{ mangerInfo.name }}</span>
          </div>
          <template #content>
            <a-doption
              @click="
                Message.success(
                  `欢迎回来--${mangerInfo.name}(${
                    mangerInfo.manger_state == '1' ? '超级管理员' : '普通访客👉'
                  })`
                )
              "
            >
              <template #icon>
                <IconSettings />
              </template>
              <template #default>{{
                mangerInfo.manger_state == '1' ? '超级管理员' : '普通访客👉'
              }}</template>
            </a-doption>
            <a-doption @click="$router.push('/profile')">
              <template #icon>
                <IconSettings />
              </template>
              <template #default>个人中心</template>
            </a-doption>
            <a-doption @click="cancelLogin">
              <template #icon>
                <IconPoweroff />
              </template>
              <template #default>退出登录</template>
            </a-doption>
          </template>
        </a-dropdown>
      </a-layout-header>
      <a-layout style="padding: 0 24px">
        <a-breadcrumb :style="{ margin: '16px 0' }">
          <a-breadcrumb-item>招聘后台管理</a-breadcrumb-item>
          <a-breadcrumb-item
            v-for="(item, index) in breadcrumbList"
            :key="index"
          >
            {{ item.name }}
          </a-breadcrumb-item>
        </a-breadcrumb>
        <a-layout-content>
          <router-view></router-view>
        </a-layout-content>
        <a-layout-footer><Footer /> </a-layout-footer>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { asideList } from './asides'
import Footer from '@/components/common/footer/index.vue'
import {
  IconCaretRight,
  IconCaretLeft,
  IconUser,
  IconPoweroff,
  IconSettings
} from '@arco-design/web-vue/es/icon'
import { Modal, Message } from '@arco-design/web-vue'
import { useMangerStore } from '@/store/manger'
import { IMangerData } from '@/types/manger'
const mangerInfo = computed(() => useMangerStore().mangerInfo[0] as IMangerData)
const router = useRouter()
const route = useRoute()

let asideData = shallowRef<any[]>([])
onMounted(() => {
  if (mangerInfo.value.manger_state != '1') {
    asideData.value = asideList.filter((item) => item.path != '/manger')
  } else {
    asideData.value = asideList
  }
})

const defaultOpenKeys = ref(['/' + route.path.split('/')[1]])
const defaultSelectedKeys = ref([route.path])
const breadcrumbList = ref<any[]>([])
watch(
  () => route.path,
  () => {
    breadcrumbList.value = asideList
      .map((item) => {
        if ('/' + route.path.split('/')[1] === item.path) {
          if (item.children?.length) {
            const subItem = item.children?.filter((sub) => {
              return sub.path === route.path
            })
            return [item, ...subItem]
          } else {
            return item
          }
        }
      })
      ?.filter((item) => item)
      ?.flat()
  },
  { immediate: true, deep: true }
)

//退出登录
const cancelLogin = () => {
  Modal.warning({
    hideCancel: false,
    cancelText: '取消',
    okText: '确认',
    title: '温馨提示',
    content: '您确定要退出登录吗？',
    onOk: () => {
      localStorage.clear()
      location.reload()
    }
  })
}
const collapsed = ref(false)
const onCollapse = () => {
  collapsed.value = !collapsed.value
}
const onClickMenuItem = (key: string) => {
  router.push(key)
}
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
  // background: rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
}
.layout-demo :deep(.arco-layout-sider-light) .logo {
  // background: var(--color-fill-2);
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
.layout-demo :deep(.arco-layout-footer) {
  color: #666;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-stretch: condensed;
  text-align: center;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .mangerInfo {
    min-width: 100px;
    height: 50px;
    margin-right: 90px;
    display: flex;
    align-items: center;
    span {
      margin-left: 8px;
    }
  }
}
</style>
