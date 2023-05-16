import { defineStore } from 'pinia'
import { selPositionTypeShow } from "@/api";
export const usePositionTypeStore = defineStore('positionType', {
  state: () => {
    return {
      positionCategory1List: [],
    }
  },
  actions: {
    async getPositionTypeShow() {
      const res: any = await selPositionTypeShow();
      if (res.code !== 200) {
        this.positionCategory1List = []
      }
      this.positionCategory1List = res.data;
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