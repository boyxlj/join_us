import { defineStore } from 'pinia'
import { getPositionType } from "@/api";
import { message } from 'ant-design-vue'
export const useJobTypeStore = defineStore('positionType', {
  state: () => {
    return {
      positionTypeList: [],
    }
  },
  actions: {
    async getJobs() {
      const res: any = await getPositionType();
      if (res.code !== 200) {
        this.positionTypeList = []
        return message.error('数据获取异常')
      }
      this.positionTypeList = res.data;
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,
      },
    ],
  }
})