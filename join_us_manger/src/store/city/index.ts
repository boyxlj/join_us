import { defineStore } from 'pinia'
import { cityList } from '../../utils/city'
import { hotCityList } from '../../utils/hotCity'
import { otherCityList } from '../../utils/otherCity'
import { provinceAndCityList } from '../../utils/city'
export const useCity = defineStore("cities", {
  state: () => {
    return {
      allCityList: cityList.length ? cityList : [],
      hotCityList: hotCityList.length ? hotCityList : [],
      otherCityList: otherCityList.length ? otherCityList : [],
      provinceAndCityList: provinceAndCityList.length ? provinceAndCityList : [],
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