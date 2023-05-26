<template>
  <div class="companyPage" id="company_mangers">
    <a-layout class="loyOut">
      <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
        <div class="title" v-if="!collapsed"><span>招聘</span>企业版</div>
        <div class="title" v-else>企业版</div>
        <div class="logo" />
        <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
          <a-menu-item
            @click="router.push(pathList[index])"
            v-for="(item, index) in menuList"
            :key="pathList[index]"
          >
            <component :is="componentsList[index]"></component>
            <span>{{ item.name }}</span>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout>
        <a-layout-header class="header" style="background: #fff; padding: 0">
          <div class="left">
            <menu-unfold-outlined
              v-if="collapsed"
              class="trigger"
              @click="() => (collapsed = !collapsed)"
            />
            <menu-fold-outlined
              v-else
              class="trigger"
              @click="() => (collapsed = !collapsed)"
            />
          </div>
          <a-dropdown>
            <div class="right">
              <p>{{ hrInfoList[0].name || "未设置昵称" }}</p>
              <a-avatar
                v-if="hrInfoList[0].avatar"
                :src="hrInfoList[0].avatar"
                size="large"
              >
                <template #icon><UserOutlined /></template>
              </a-avatar>
              <a-avatar v-else size="large">
                <template #icon><UserOutlined /></template>
              </a-avatar>
            </div>
            <template #overlay>
              <a-menu>
                <a-menu-item key="1" @click="$router.push('/company/profile')"
                  >个人中心</a-menu-item
                >
                <a-menu-item key="2" @click="cancelLogin">退出登录</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </a-layout-header>
        <a-layout-content
          :style="{
            margin: '24px 16px',
            padding: '24px',
            background: '#fff',
            minHeight: '280px',
          }"
        >
          <router-view></router-view>
        </a-layout-content>
        <!-- <div class="footer"> -->
        <!-- <Footer/> -->
        <!-- </div> -->
      </a-layout>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import {
  BarChartOutlined,
  BarsOutlined,
  SearchOutlined,
  AuditOutlined,
  BankOutlined,
  ToolOutlined,
  MoreOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons-vue";
import { createVNode } from "vue";
import { IHrData } from "@/types/hr";
import { useHrInfo } from "@/store/hr";
import { Modal } from "ant-design-vue";
import Footer from "@/components/common/footer/index.vue";
const hrInfoList = computed(() => useHrInfo().hrInfoList as IHrData[]);
const route = useRoute();
const router = useRouter();
const selectedKeys = ref<string[]>([route.path]);
const collapsed = ref<boolean>(false);
const path = route.path;
const componentsList = [
  BarChartOutlined,
  BarsOutlined,
  SearchOutlined,
  AuditOutlined,
  BankOutlined,
  ToolOutlined,
  MoreOutlined,
];
const menuList = ref([
  { id: 0, name: '数据分析' },
  { id: 1, name: "职位管理" },
  // { id: 2, name: '搜索牛人' },
  { id: 3, name: "简历审核" },
  { id: 6, name: "公司信息" },
  // { id: 4, name: '工具箱' },
  { id: 5, name: "个人中心" },
]);
const pathList = [
  '/company/statistics',
  "/company/positionManage",
  // '/company/searchCattle',
  "/company/resumeReview",
  "/company/companyInfo",
  // '/company/toolBox',
  "/company/profile",
];

const cancelLogin = () => {
  Modal.confirm({
    title: "温馨提示",
    cancelText: "取消",
    okText: "确认",
    centered: true,
    icon: createVNode(ExclamationCircleOutlined),
    content: "您确定要退出登录吗",
    onOk() {
      // localStorage.clear();
      localStorage.removeItem("companyToken");
      localStorage.removeItem("company_id");
      location.reload();
    },
    onCancel() {},
    class: "test",
  });
};
</script>

<style lang="less">
#company_mangers {
  .ant-btn {
    border-radius: 4px !important;
  }
  .ant-tag {
    border-radius: 4px !important;
  }
  .ant-input {
    border-radius: 4px !important;
  }
}
.ant-input {
  border-radius: 4px !important;
}
.ant-select-selector {
  border-radius: 4px !important;
}
.footer {
  position: fixed;
  left: 50%;
  width: 100%;
  transform: translateX(-50%);
  bottom: -18px;
  ::v-deep(.footer) {
    font-size: 12px !important;
  }
}
.ant-layout {
  height: 100vh !important;

  .ant-layout-header {
    padding: 0 20px !important;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .right {
      min-width: 120px;
      margin-right: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      p {
        margin: 0;
        margin-right: 8px;
      }
    }
  }
  .ant-layout-content {
    padding: 20px !important;
    box-sizing: border-box;
    overflow-y: auto;
  }
  .ant-layout-sider {
    background: #fff;
    color: #111 !important;
    .ant-menu {
      background: #fff !important;
      color: #111 !important;
    }
    .ant-menu-item{
      height: 50px;
      color: #222;
      margin: 6px 0 4px;
    }
  }
  .title {
    color: #fff;
    height: 64px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--themeColor);
    // color: #222;
    font-weight: 500;
    font-size: 18px;

    span {
      font-size: 20px;
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
