<template>
  <div class="job">
    <div class="bg">
      <div class="top">
        <div class="search">
          <Search :center="false" />
          <div class="loginState" @click="navigateLoginPage">
            <export-outlined class="icon" /> 登录, 查看更多岗位
          </div>
        </div>
        <p class="tabs"><span>城市和区域</span></p>
        <div class="cityBox">
          <div class="city" @click="clickCity">
            <span v-for="item in hotCityList" :class="activeCityId===item.code?'active':''" :data-id='item.code' :key="item.code">{{ item.name }}</span>
          </div>
          <div class="city qu" @click="clickQu" v-if="showQu">
            <span>不限</span>
            <span v-for="item in quList" :class="activeQuId===item.code?'active':''" :data-id='item.code' :key="item.code">{{ item.name }}</span>
          </div>
          <div class="city select">
            <a-select
              v-for="item in 8"
              :key="item"
              ref="select"
              v-model:value="formData.value1"
              style="width: 120px"
              @focus="focus"
              @change="handleChange"
            >
              <a-select-option value="供应链/物流">供应链/物流</a-select-option>
              <a-select-option value="房地产/建筑">房地产/建筑</a-select-option>
              <a-select-option value="农/林/牧/渔">农/林/牧/渔</a-select-option>
              <a-select-option value="咨询/翻译/法律">咨询/翻译/法律</a-select-option>
              <a-select-option value="旅游">旅游</a-select-option>
              <a-select-option value="服务业">服务业</a-select-option>
              <a-select-option value="生产制造">生产制造</a-select-option>
              <a-select-option value="其他">其他</a-select-option>
            </a-select>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="left">
        <JobList />
      </div>
      <div class="right">

         
        <span v-if="cityData.city">选择城市 <br><br>{{ cityData.city }} -- id {{ cityData.cityId }}</span><br><br> <br>
        <span 选择区 v-if="cityData.qu">选择区 <br><br>{{ cityData.qu }} -- id {{ cityData.quId }}</span> 
      </div>
    </div>

    <div
    id="active"
      class="animate__animated animate__fadeInDown"
      :style="{ display: showNavBar ? 'block' : 'none' }"
    >
      <NavBar />
      <div class="searchBar">
        <Search :center="false" :height="80" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ExportOutlined } from "@ant-design/icons-vue";
import Search from "@/components/common/search/index.vue";
import JobList from "./components/jobList/index.vue";
import NavBar from "@/components/common/navbar/index.vue";
import {cityList} from "@/utils/city"
import {hotCityList} from "@/utils/hotCity"
const allCities  = ref(cityList.map(item=>item.subLevelModelList).flat())
const quList  = ref<any>([])
const activeCityId = ref(0)
const activeQuId = ref(0)
const showQu = ref(true)

const  cityData = reactive({
  qu:'',
  quId:'',
city:'',
cityId:'',
})
const clickCity = (e:any)=>{
  if(!e.target.dataset.id) return
  if(e.target.innerText==='全国'){
    showQu.value = false

    cityData.cityId = e.target.dataset.id
  cityData.city =  e.target.innerText

  }else{
    showQu.value = true
  }
  activeCityId.value = e.target.dataset.id*1
  getQu(e.target.innerText)


  cityData.cityId = e.target.dataset.id
  cityData.city =  e.target.innerText

}
const clickQu = (e:any)=>{
  if(!e.target.dataset.id) return
  activeQuId.value = e.target.dataset.id*1


  cityData.quId = e.target.dataset.id
  cityData.qu =  e.target.innerText

}

onMounted(()=>{
  getQu('武汉')
})
const getQu = (cityName:string = '武汉')=>{
  quList.value = allCities.value.filter(item=>{
    if(item.name===cityName){
      return item.subLevelModelList
    }
  })[0].subLevelModelList


}
const router = useRouter()
const navigateLoginPage = ()=>{
  router.push('/login')
}
const handleChange = () => {};
const focus = () => {};
const formData = reactive({
  value1: "职位类型",
});

const showNavBar = ref(false);
onMounted(() => {
  window.addEventListener("scroll", getScrollTop);
});
onUnmounted(() => {
  window.removeEventListener("scroll", getScrollTop);
});

const getScrollTop = () => {
  const val = document.documentElement.scrollTop;
  if (val >= 300) {
    showNavBar.value = true;
  } else {
    showNavBar.value = false;
  }
};
</script>

<style lang="less" scoped>
@import "@/assets/css/common.less" ;
.job {
  .bg {
    background: #fff;
    .top {
      width: 1200px;
      margin: 0 auto;
      min-height: 240px;
      padding-bottom: 15px;
      .search {
        display: flex;
        justify-content: space-between;
        position: relative;
        .loginState {
          background: #fff;
          position: absolute;
          right: 0;
          top: 50%;
          height: 50px;
          width: 280px;
          padding: 0 50px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: var(--radiusSize);
          border: 1px solid var(--themeColor);
          transform: translateY(-50%);
          color: var(--themeColor);
          cursor: pointer;
          transition: all 0.2s;
          font-size: 16px;
          .icon {
            margin-right: 10px;
          }
          &:hover {
            background: var(--themeColor);
            color: #fff;
          }
        }
      }
      .tabs {
        font-size: 16px;
        color: var(--themeColor);
        margin-top: -20px;
        span {
          cursor: pointer;
          padding-bottom: 6px;
          border-bottom: 3px solid var(--themeColor);
        }
      }
      .cityBox {
        .city {
          display: flex;
          min-height: 45px;
          padding: 0 8px;
          box-sizing: border-box;
          justify-content: flex-start;
          flex-wrap: wrap;
          align-items: center;
          .active{
            color: var(--themeColor);
          }
          span {
            margin-right: 22px;
            cursor: pointer;
            color: #333;
            font-size: 14px;
            transition: all 0.2s;
            &:hover {
              color: var(--themeColor);
            }
          }
        }
        .qu {
          min-height: 45px !important;
          padding: 10px 8px;
          span{
            margin: 5px 22px 5px 0;
          }
          background: #f8f8f8;
        }
        .select {
          margin-top: 10px;
          display: flex;
          justify-content: flex-start;
          .ant-select {
            margin-right: 20px;
            margin-left: -8px;
            &:hover {
              ::v-deep(.ant-select-selector) {
                background: #e3daf4 !important;
              }
            }
          }
        }
      }
    }
  }

  .content {
    width: 1200px;
    margin: 0 auto;
    min-height: 300px;
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    .left {
      width: 75%;
      height: 100%;
      // background: skyblue;
    }
    .right {
      width: 24%;
      height: 100%;
      // background: sandybrown;
    }
  }
}

::v-deep(.ant-select-selector) {
  border-radius: 4px !important;
  border: none !important;
  background: #f8f8f8 !important;
}

.ant-select-focused:not(.ant-select-disabled).ant-select:not(
    .ant-select-customize-input
  )
  .ant-select-selector {
  border-color: none !important;
  box-shadow: 0 0 0 0 none !important;
  border-right-width: 1px !important;
  outline: 0;
}

.ant-select-focused:not(.ant-select-disabled).ant-select:not(
    .ant-select-customize-input
  ) {
  ::v-deep(.ant-select-selector) {
    border-color: none !important;
    box-shadow: 0 0 0 0 none !important;
    border-right-width: 1px !important;
    outline: 0;
  }
}
</style>
