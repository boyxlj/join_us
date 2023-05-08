<template>
  <div class="job">
    <div class="bg">
      <div class="top">
        <div class="search">
          <Search :center="false">
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
        <CompanyList v-if="companyData.length" :companyData="companyData" />
        <div class="empty" v-else>
          <Empty msg="没有查询到相关的公司，修改筛选条件试一下" />
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
        <Search :center="false" :height="80">
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
import CompanyList from "./components/companyList/index.vue";
import NavBar from "@/components/common/navbar/index.vue";
import DropDownlist from "@/components/common/dropDownlist/index.vue";
import Empty from "@/components/common/empty/index.vue";
import { useCity } from "@/store/city";
import { useUserLoginState } from "@/hooks/useUserLoginState";
import { useGetConditionData } from "@/store/condition";
import { selectCompanys } from "@/api";
import { message } from "ant-design-vue";
import { ICompanyData } from "@/types/company";
const route = useRoute();
const router = useRouter();
const { hotCityList, allCityList, preventCity } = useCity();
const keyName = ["industry", "people_num", "financing"];
const keyword = ref(route.query.keyword as string);
const position_type1 = ref(route.query.position_type1 as string);
const position_type2 = ref(route.query.position_type2 as string);
const showNavBar = ref(false);
onMounted(() => {
  window.addEventListener("scroll", getScrollTop);
  if (cityData.city) {
    if (cityData.city == "全国") {
      getCompanyData();
      return (showQu.value = false);
    }
    getQu(cityData.city);
  } else {
    getQu("武汉");
  }
  getCompanyData()
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
watch(
  () => route.query,
  () => {
    pageNationParams.pageOn = 1;
    keyword.value = route.query.keyword as string;
    getCompanyData();
  }
);
const companyData = ref<ICompanyData[]>([]);

const pageNationParams = reactive({
  pageOn: 1,
  pageSize: 30,
  total: 0,
});
const changePageNation = (page: number, pageSize: number) => {
  pageNationParams.pageOn = page;
  document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
  getCompanyData();
};

//选择城市模态框
const visible = ref(false);
const handleOk = () => {
  visible.value = false;
};

//切换城市
const clickCityItem = (cityName: string, code: number) => {
  cityData.city = cityName;
  paramsCity.value = cityName;
  if (cityName === "全国") {
    showQu.value = false;
  } else {
    showQu.value = true;
    getQu(cityName);
  }
  visible.value = false;
  //发送请求
  activeCityId.value = code;
  pageNationParams.pageOn = 1;
  getCompanyData();
};

//获取职位列表数据
const getCompanyData = async () => {
  const newObj: any = {};
  for (let i in formData) {
    newObj[keyName[(i.slice(5) as any) * 1]] = formData[i];
  }
  const params = {
    region: cityData.qu,
    keyword: keyword.value,
    ...newObj,
    position_type1: position_type1.value,
    position_type2: position_type2.value,
    reg_city:
      keyword.value || position_type1 || position_type2
        ? paramsCity.value
        : cityData.city,
    ...pageNationParams,
  };

  for (let item in params) {
    if (params[item] == "不限" || !params[item]) {
      delete params[item];
    }
  }

  const res: any = await selectCompanys(params);
  if (res.code !== 200) {
    companyData.value = [];
    message.error("服务异常");
  } else {
    pageNationParams.total = res.total;
    companyData.value = res.data;
  }
};
const showCityModel = () => {
  visible.value = true;
};

let condition: any = useGetConditionData();
const cityNameData = [
  { code: 0, name: "不限" },
  { code: 1, name: "计算机软件" },
  { code: 2, name: "医疗健康" },
  { code: 3, name: "体育健身" },
];
condition = [
  cityNameData,
  condition.conditionData[condition.conditionData.length - 2],
  condition.conditionData[condition.conditionData.length - 1],
];
const conditionData = ref(condition);
const loginState = useUserLoginState(true);
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
  pageNationParams.pageOn = 1;
  //发送请求
  getCompanyData();
};

//区域不限
const quAll = () => {
  cityData.qu = "";
  activeQuId.value = -1;
  getCompanyData();
};
//清空选中内容
const random = ref(-1);
const clearSelect = () => {
  for (let item in formData) {
    formData[item] = "不限";
  }
  random.value = Math.random();
  //发送请求
  pageNationParams.pageOn = 1;
  getCompanyData();
};

const cityData = reactive({
  qu: "",
  quId: "",
  city: preventCity,
  cityId: "",
});

const paramsCity = ref("");
const clickCity = (e: any) => {
  if (!e.target.dataset.id) return;
  if (e.target.innerText === "全国") {
    showQu.value = false;
  } else {
    showQu.value = true;
    getQu(e.target.innerText);
  }
  activeCityId.value = e.target.dataset.id * 1;
  paramsCity.value = e.target.innerText;
  cityData.city = e.target.innerText;
  cityData.qu = "";
  pageNationParams.pageOn = 1;
  getCompanyData();
};
const clickQu = (e: any) => {
  if (!e.target.dataset.id) return;
  activeQuId.value = e.target.dataset.id * 1;
  cityData.qu = e.target.innerText;
  pageNationParams.pageOn = 1;
  getCompanyData();
};



const getQu = (cityName: string = "武汉") => {
  quList.value = allCities.value.filter((item) => {
    if (item.name === cityName) {
      return item.subLevelModelList;
    }
  })[0].subLevelModelList;
};

const navigateLoginPage = () => {
  router.push("/login");
};
const formData = reactive<any>({
  value0: "不限",
  value1: "不限",
  value2: "不限",
});
const showValues = ref(["所属行业", "公司规模", "融资阶段"]);


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
      width: 100%;
      height: 100%;

      .pageNation {
        width: 100%;
        margin: 40px auto 70px;
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
