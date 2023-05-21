<template>
  <div class="about">
    <div class="info">
      <div class="left">
        <a-avatar v-if="data[0]?.avatar" :src="data[0]?.avatar" :size="64">
          <template #icon><UserOutlined /></template>
        </a-avatar>
        <a-avatar v-else :size="64">
          <template #icon><UserOutlined /></template>
        </a-avatar>
       <div class="user">
        <p>{{ data[0]?.name }}</p>
        <p><span>发布于：</span>{{ getTime(data[0]?.publish_time) }}</p>
       </div>
      </div>
      <p><span>更新于：</span>{{ getTime(data[0]?.updateTime) }}</p>
    </div>
    <MdPreview previewTheme="github" v-model="content" />
  </div>
</template>

<script setup lang="ts">
import { IConsultData } from "@/types/consult";
import { getTime } from "@/utils/formatTime";
import { getAbout } from "@/api";
import { UserOutlined } from "@ant-design/icons-vue";
import { MdPreview } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
const data = ref<IConsultData[]>([]);
const content = ref("");
onMounted(async () => {
  const res: any = await getAbout();
  if (res.code !== 200) {
    return (data.value = []);
  }
  data.value = res.data;
  content.value = res.data[0]?.content;
});
</script>

<style lang="less" scoped>
.about {
  width: 1200px;
  margin: 30px auto;
  min-height: 80vh;
  padding: 20px 15px 30px;
  box-sizing: border-box;
  border-radius: 10px;
  background: #fff;
  .info {
    width: 100%;
    height: 80px;
    background: #f8f8f8;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    box-sizing:border-box;
    margin-bottom: 20px;
    p{
      margin: 0;
    }
    .left{
      display: flex;
      align-items: center;
      .user{
        display: flex;
        flex-direction: column;
        margin-left: 20px;
      }
    }
  }
}
</style>
