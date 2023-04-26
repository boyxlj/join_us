import { defineStore } from 'pinia'
import { getPositionHotSearchList, getSortOrRandomPosition } from "../../api"
import { message } from 'ant-design-vue'
export const useHotSearchPosition = defineStore('hotSearchPosition', {
  state: () => {
    return {
      hotSearchPositionList: [],
      sortPositionData: [],
      randomPositionData: [],

    }
  },
  actions: {
    async getData(cityName: string) {
      const res: any = await getPositionHotSearchList(cityName)
      if (res.code !== 200) {
        message.error('数据请求异常')
        this.hotSearchPositionList = []
        return
      } else {
        this.hotSearchPositionList = res.data
      }
    },
    async getSortOrRandomData(cityName: string) {
      const res: any = await getSortOrRandomPosition({cityName})
      if (res.code !== 200) {
        message.error('数据请求异常')
        this.sortPositionData = []
        this.randomPositionData = []
        return
      } else {
        this.sortPositionData = res.data.sortPositionData
        this.randomPositionData = res.data.randomPositionData
      }
    }
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