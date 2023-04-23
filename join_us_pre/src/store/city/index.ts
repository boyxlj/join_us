import { defineStore } from 'pinia'
import { cityList } from '../../utils/city'
import { hotCityList } from '../../utils/hotCity'
import { otherCityList } from '../../utils/otherCity'
export const useCity = defineStore("cities", {
  state: () => {
    return {
      preventCity: '武汉',
      allCityList: cityList.length ? cityList : [],
      hotCityList: hotCityList.length ? hotCityList : [],
      otherCityList: otherCityList.length ? otherCityList : [],
    }
  },
  actions: {
   async changeCity(cityName: string) {
      if (cityName) {
        this.preventCity = cityName
      } else {
        this.preventCity = '武汉'
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