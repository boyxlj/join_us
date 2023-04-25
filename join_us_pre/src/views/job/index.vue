<template>
  <div class="job">
    <div class="bg">
      <div class="top">
        <div class="search">
          <Search  :center="false">
            <template #searchSelect>
              <div @click="showCityModel" class="citySelect">
                <span class="name">{{
                  cityData.city ? cityData.city : "城市选择"
                }}</span>
                <span class="arrow"></span>
              </div>
            </template>
          </Search>
          <div class="loginState" v-if="!loginState" @click="navigateLoginPage">
            <export-outlined class="icon" /> 登录, 查看更多岗位
          </div>
        </div>
        <p class="tabs"><span>城市和区域</span></p>
        <div class="cityBox">
          <div class="city" @click="clickCity">
            <span
              v-for="item in hotCityList"
              :class="activeCityId === item.code ? 'active' : ''"
              :data-id="item.code"
              :key="item.code"
              >{{ item.name }}</span
            >
          </div>
          <div class="city qu" @click="clickQu" v-if="showQu">
            <span @click="quAll">不限</span>
            <span
              v-for="item in quList"
              :class="activeQuId === item.code ? 'active' : ''"
              :data-id="item.code"
              :key="item.code"
              >{{ item.name }}</span
            >
          </div>

          <div class="city select">
            <div class="left" :key="random">
              <template v-for="(item, index) in conditionData" :key="index">
                <DropDownlist
                  class="dropDownlist"
                  @change="getClickValue"
                  :conditionName="showValues[index]"
                  v-model:selectValue="formData[`value${index}`]"
                  :itemList="conditionData[index]"
                  :idx="index"
                >
                </DropDownlist>
              </template>
            </div>
            <div class="clearSelect" @click="clearSelect">清空筛选条件</div>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="left">
        <JobList v-if="positionData.length" :positionData="positionData" />
        <div class="empty" v-else>
          <Empty />
        </div>
        <div class="pageNation">
          <a-pagination
            @change="changePageNation"
            v-model:current="pageNationParams.pageOn"
            :showSizeChanger="false"
            v-show="pageNationParams.total"
            :pageSize="pageNationParams.pageSize"
            :total="pageNationParams.total"
          />
        </div>
      </div>
    </div>

    <div
      id="active"
      class="animate__animated animate__fadeInDown"
      :style="{ display: showNavBar ? 'block' : 'none' }"
    >
      <NavBar />
      <div class="searchBar">
        <Search  :center="false" :height="80">
          <template #searchSelect>
            <div @click="showCityModel" class="citySelect">
              <span class="name">{{
                cityData.city ? cityData.city : "城市选择"
              }}</span>
              <span class="arrow"></span>
            </div>
          </template>
        </Search>
      </div>
      <div class="selectTop">
        <div class="city select">
          <div class="left" :key="random">
            <template v-for="(item, index) in conditionData" :key="index">
              <DropDownlist
                class="dropDownlist"
                @change="getClickValue"
                :conditionName="showValues[index]"
                v-model:selectValue="formData[`value${index}`]"
                :itemList="conditionData[index]"
                :idx="index"
              >
              </DropDownlist>
            </template>
          </div>
          <div class="clearSelect" @click="clearSelect">清空筛选条件</div>
        </div>
      </div>
    </div>
    <!-- 城市选择 -->
    <a-modal
      v-model:visible="visible"
      :footer="null"
      centered
      title="请选择城市"
      @ok="handleOk"
      :width="560"
    >
      <div class="cityBox">
        <li
          @click="clickCityItem(item.name, item.code)"
          v-for="item in hotCityList"
          :key="item.code"
        >
          {{ item.name }}
        </li>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ExportOutlined } from "@ant-design/icons-vue";
import Search from "@/components/common/search/index.vue";
import JobList from "./components/jobList/index.vue";
import NavBar from "@/components/common/navbar/index.vue";
import DropDownlist from "@/components/common/dropDownlist/index.vue";
import Empty from "@/components/common/empty/index.vue";
import { useCity } from "@/store/city";
import { useUserLoginState } from "@/hooks/useUserLoginState";
import { useGetConditionData } from "@/store/condition";
import { getPositionList } from "@/api";
import { message } from "ant-design-vue";
const route = useRoute()
const { hotCityList, allCityList, preventCity } = useCity();
const keyName = [
  "job_type",
  "experiences",
  "salary",
  "degrees",
  "people_num",
  "financing",
];
const keyword = ref(route.query.keyword as string )

watch(()=>route.query,()=>{
  pageNationParams.pageOn = 1
  keyword.value = route.query.keyword as string
  getPositionData()
})
const positionData = ref([]);

const pageNationParams = reactive({
  pageOn: 1,
  pageSize: 10,
  total: 100,
});
const changePageNation = (page: number, pageSize: number) => {
  document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
  pageNationParams.pageOn = page;
  getPositionData();

};

//选择城市模态框
const visible = ref(false);
const handleOk = () => {
  visible.value = false;
};
const clickCityItem = (cityName: string, code: number) => {
  cityData.city = cityName;
  if (cityName === "全国") {
    showQu.value = false;
  } else {
    showQu.value = true;
  }
  visible.value = false;
  //发送请求
  activeCityId.value = code;
  getQu(cityName);
  pageNationParams.pageOn = 1
  getPositionData();
};

//获取职位列表数据
const getPositionData = async () => {
  const newObj: any = {};
  for (let i in formData) {
    newObj[keyName[(i.slice(5) as any) * 1]] = formData[i];
  }
  const params = {
    region: cityData.qu,
    keyword:keyword.value,
    ...newObj,
    cityName: cityData.city,
    ...pageNationParams,
  };

  for (let item in params) {
    if (params[item] == "不限" || !params[item]) {
      delete params[item];
    }
  }

  console.log("@@@@", params);
  const res: any = await getPositionList(params);
  console.log("#########", res);
  if (res.code !== 200) {
    positionData.value = [];
    message.error("服务异常");
  } else {
    pageNationParams.total = res.total;
    positionData.value = res.data;
  }
};
const showCityModel = () => {
  visible.value = true;
};

const condition = useGetConditionData();
const conditionData = ref(condition.conditionData);
const loginState = useUserLoginState();

const allCities = ref(allCityList.map((item) => item.subLevelModelList).flat());
const quList = ref<any>([]);
const activeCityId = ref(0);
const activeQuId = ref(0);
const showQu = ref(true);

///------------
const getClickValue = (val: string, idx: number) => {
  for (let item in formData) {
    if (item.includes(idx + "")) {
      formData[item] = val;
    }
  }
  pageNationParams.pageOn = 1
  //发送请求
  getPositionData();
};

//区域不限
const quAll = () => {
  cityData.qu = "";

  getPositionData();
};
//清空选中内容
const random = ref(-1);
const clearSelect = () => {
  for (let item in formData) {
    formData[item] = "不限";
  }
  random.value = Math.random();
  //发送请求
  pageNationParams.pageOn = 1
  getPositionData();
};

const cityData = reactive({
  qu: "",
  quId: "",
  city: preventCity,
  cityId: "",
});
const clickCity = (e: any) => {
  if (!e.target.dataset.id) return;
  if (e.target.innerText === "全国") {
    showQu.value = false;
    cityData.city = e.target.innerText;
  } else {
    showQu.value = true;
    getQu(e.target.innerText);
    activeCityId.value = e.target.dataset.id * 1;
    cityData.city = e.target.innerText;
  }
  cityData.qu = "";
  pageNationParams.pageOn = 1
  getPositionData();
};
const clickQu = (e: any) => {
  if (!e.target.dataset.id) return;
  activeQuId.value = e.target.dataset.id * 1;
  cityData.qu = e.target.innerText;
  pageNationParams.pageOn = 1
  getPositionData();
};

onMounted(() => {
  if (cityData.city) {
    if (cityData.city === "全国") {
      getPositionData();
      return (showQu.value = false);
    }
    getQu(cityData.city);
  } else {
    getQu("武汉");
  }
  getPositionData();
});
const getQu = (cityName: string = "武汉") => {
  quList.value = allCities.value.filter((item) => {
    if (item.name === cityName) {
      return item.subLevelModelList;
    }
  })[0].subLevelModelList;
};
const router = useRouter();
const navigateLoginPage = () => {
  router.push("/login");
};
const formData = reactive<any>({
  value0: "不限",
  value1: "不限",
  value2: "不限",
  value3: "不限",
  value4: "不限",
  value5: "不限",
});
const showValues = ref([
  "求职类型",
  "工作经验",
  "薪资待遇",
  "学历要求",
  "公司规模",
  "融资阶段",
]);

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
@import "@/assets/css/common.less";
.job {
  .bg {
    background: #fff;
    .top {
      width: 1200px;
      margin: 0 auto;
      min-height: 230px;
      padding-bottom: 0px !important;
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
          width: 1150px;
          display: flex;
          min-height: 45px;
          padding: 0 8px;
          box-sizing: border-box;
          justify-content: flex-start;
          flex-wrap: wrap;
          align-items: center;
          .active {
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
          span {
            margin: 5px 22px 5px 0;
          }
          background: #f8f8f8;
        }
        .select {
          width: 100%;
          margin-top: 10px;
          display: flex;
          margin-left: -10px;
          padding: 10px 8px;
          justify-content: space-between;
          .dropDownlist {
            margin-right: 25px;
          }
          .left {
            flex: 1;
            display: flex;
          }
          .clearSelect {
            width: 100px;
            font-size: 14px;
            transition: all 0.2s linear;
            cursor: pointer;
            font-size: 14px;
            &:hover {
              color: var(--themeColor);
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
      .pageNation {
        width: 100%;
        margin: 40px auto 70px;
        // text-align: center;
        display: flex;
        justify-content: center;
      }
    }
    .right {
      width: 24%;
      height: 100%;
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
.cityBox {
  padding: 10px 5px 10px 10px;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  li {
    width: 94px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s linear;
    border: 1px solid #ddd;
    margin-right: 30px;
    margin-bottom: 30px;
    border-radius: 6px;
    cursor: pointer;
    &:hover {
      border: 1px solid var(--themeColor);
      color: var(--themeColor);
    }
  }
}

#active {
  height: 210px;
}
</style>
