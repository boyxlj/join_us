import { defineStore } from 'pinia'
import { cityList } from '../../utils/city'
import { hotCityList } from '../../utils/hotCity'
import { otherCityList } from '../../utils/otherCity'
import { provinceAndCityList } from '../../utils/city'
import {selectConsultCategory} from "../../api"
export const useCity = defineStore("cities", {
  state: () => {
    return {
      preventCity: '武汉',
      allCityList: cityList.length ? cityList : [],
      hotCityList: hotCityList.length ? hotCityList : [],
      otherCityList: otherCityList.length ? otherCityList : [],
      provinceAndCityList: provinceAndCityList.length ? provinceAndCityList : [],
      consultCategoryData:[]
    }
  },
  actions: {
    async changeCity(cityName: string) {
      if (cityName) {
        this.preventCity = cityName
      } else {
        this.preventCity = '武汉'
      }
    },
    async getCity(){
        const res:any  =await  selectConsultCategory()
        if(res.code!==200) {
          return Promise.reject(400)
        } 
        this.consultCategoryData = res.data
        return Promise.resolve(200)
       
      },
    async setCity() {
      this.allCityList = cityList
      console.log(cityList)
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