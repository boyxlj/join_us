import { defineStore } from 'pinia'
import { getJobType } from "@/api";
import { message } from 'ant-design-vue'
export const useJobTypeStore = defineStore('jobType', {
  state: () => {
    return {
      jobTypeList: [],
    }
  },
  actions: {
    async getJobs() {
      const res: any = await getJobType();
      if (res.code !== 200) {
        this.jobTypeList = []
        return message.error('数据获取异常')
      }
      this.jobTypeList = res.data;
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