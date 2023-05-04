<template>
  <div class="userJob">
    <div class="container">
      <div class="left">
        <div class="top">
          <Search
            :center="false"
            class="search"
            :inputWidth="830"
            :optionWidth="86"
            :showBoxWidth="565"
          >
            <template #searchSelect>
              <div @click="showCityModel" class="citySelect">
                <span class="name">{{
                  preventCity ? preventCity : "城市选择"
                }}</span>
                <span class="arrow"></span>
              </div>
            </template>
          </Search>
          <div class="exp">
            <span class="hope">期望</span>
            <span class="hope_job">前端开发工程师(北京)</span>
            <span class="hope_job_others">前端开发工程师(北京)</span>
          </div>
          <div class="tags">
            <span>城市和区域</span>
          </div>
          <div class="cityBox" v-if="showQu">
            <span @click="clickAll">不限</span>
            <span
              :class="activeQuId === item.code ? 'quActive' : ''"
              @click="clickQu(item.code, item.name)"
              v-for="item in cityQuList"
              :key="item.code"
              >{{ item.name }}</span
            >
          </div>
          <div class="condition">
            <div class="item" :key="random">
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
            <div class="clear" @click="clearCondition">清空筛选条件</div>
          </div>
        </div>

        <div class="list">
          <JobList v-if="positionData.length" :positionData="positionData" />
          <div class="empty" v-else>
            <Empty />
          </div>
          <div class="pageNation">
            <a-pagination
              @change="changePageNation"
              v-model:current="params.pageOn"
              :showSizeChanger="false"
              v-show="totalData"
              :pageSize="params.pageSize"
              :total="totalData"
            />
          </div>
        </div>
      </div>
      <div class="right">
        <div class="userCard">
          <div class="info">
            <div class="left">
              <img
                :src="userInfo.avatar"
                alt=""
              />
            </div>
            <div class="right">
              <div class="top">{{ userInfo.name }}</div>
              <div class="bottom">
                <span>{{ getAge(userInfo.born) }}岁</span>
                <span>{{ userInfo.leave_schoolTime?.split('-')[0] }}年应届生</span>
                <span>{{ userInfo.degree }}</span>
              </div>
            </div>
          </div>
          <div class="btns" @click="$router.push('/home/user/resume')">编辑</div>
          <div class="sendInfo">
            <li><span class="weight">842</span><span>已投递</span></li>
            <li><span class="weight">45</span><span>不合适</span></li>
            <li><span class="weight">0</span><span>面试</span></li>
            <li><span class="weight">329</span><span>感兴趣</span></li>
          </div>
        </div>
        <div class="resume">
          <div class="title">附件简历</div>
          <div class="resumeContent">
            <div class="list">
              <li>
                <span>个人简历-pdf</span
                ><span class="del"><delete-outlined /></span>
              </li>
            </div>
            <div class="btns">上传附件简历</div>
          </div>
        </div>
        <div class="card">
          <PositionCard></PositionCard>
          <PositionCard origin="sort" title="最新职位"></PositionCard>
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

    <div class="navbar">
      <Navbar />
    </div>
  </div>
</template>

<script setup lang="ts">
import { message } from "ant-design-vue";
import { DeleteOutlined } from "@ant-design/icons-vue";
import Search from "@/components/common/search/index.vue";
import Empty from "@/components/common/empty/index.vue";
import { useCity } from "@/store/city";
import { useGetConditionData } from "@/store/condition";
import DropDownlist from "@/components/common/dropDownlist/index.vue";
import JobList from "@/components/common/jobList/index.vue";
import PositionCard from "@/components/common/positionCard/index.vue";
import {getAge} from "@/utils/getAge"
import { getPositionList } from "@/api";
import {useUserInfo} from "@/store/user"
import {IUserInfo} from "@/types/userInfo"
const userStore = useUserInfo()
const userInfo =(computed(()=>userStore.userInfoList[0]) as unknown) as  IUserInfo
const hotCityList = computed(() => useCity().hotCityList);
const allCityList = computed(() => useCity().allCityList);
const preventCity = ref(useCity().preventCity);
const cityQuList = ref<any>([]);
const activeQuId = ref();
const route = useRoute();
//获取条件帅选数据
const condition = useGetConditionData();
const conditionData = ref(condition.conditionData);
const totalData = ref(100);
//选择城市模态框
const visible = ref(false);
const handleOk = () => {
  visible.value = false;
};
const showCityModel = () => {
  visible.value = true;
};
const keyName = [
  "job_type",
  "experiences",
  "salary",
  "degrees",
  "people_num",
  "financing",
];
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

//切换筛选条件
const getClickValue = (val: string, idx: number) => {
  for (let item in formData) {
    if (item.includes(idx + "")) {
      formData[item] = val;
    }
  }
  params.pageOn = 1;
  getPositionData();
};

//切换分页
const changePageNation = (page: number, pageSize: number) => {
  params.pageOn = page;
  document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
  getPositionData();
};

const keyword = ref(route.query.keyword as string);

watch(
  () => route.query,
  () => {
    params.pageOn = 1;
    keyword.value = route.query.keyword as string;
    getPositionData();
  }
);

const paramsCity = ref("");
const showQu = ref(true);
//切换城市
const clickCityItem = (cityName: string, code: number) => {
  paramsCity.value = cityName;
  preventCity.value = cityName;
  if (cityName === "全国") {
    showQu.value = false;
  } else {
    showQu.value = true;
    getQu(cityName);
  }
  visible.value = false;
  //发送请求
  params.pageOn = 1;
  getPositionData();
};

//请求参数
const params = reactive({
  region: "", //区名称
  pageOn: 1,
  pageSize: 10,
});

const positionData = ref([]);

//发送请求
const getPositionData = async () => {
  const newObj: any = {};
  for (let i in formData) {
    newObj[keyName[(i.slice(5) as any) * 1]] = formData[i];
  }
  const paramsReq = {
    keyword: keyword.value,
    ...newObj,
    // cityName:keyword.value? preventCity.value:preventCity.city,
    cityName: preventCity.value,
    ...params,
  };

  for (let item in paramsReq) {
    if (paramsReq[item] == "不限" || !paramsReq[item]) {
      delete paramsReq[item];
    }
  }

  const res: any = await getPositionList(paramsReq);
  if (res.code !== 200) {
    positionData.value = [];
    message.error("服务异常");
  } else {
    totalData.value = res.total;
    positionData.value = res.data;
  }
};
const allCities = ref(
  allCityList.value?.map((item) => item.subLevelModelList).flat()
);
//获取当前城市所有区域
const getQu = (cityName: string = "武汉") => {
  cityQuList.value = allCities.value?.filter((item) => {
    if (item.name == cityName) {
      return item.subLevelModelList;
    }
  })[0]?.subLevelModelList;
};
//点击区
const clickQu = (id: number, name: string) => {
  params.region = name;
  activeQuId.value = id;
  params.pageOn = 1;
  getPositionData();
};
//点击不限
const clickAll = () => {
  params.region = "";
  activeQuId.value = -1;
  params.pageOn = 1;
  getPositionData();
};

//清空筛选条件
const random = ref(-1);
const clearCondition = () => {
  for (let item in formData) {
    formData[item] = "不限";
  }
  random.value = Math.random();
  params.pageOn = 1;
  getPositionData();
};

onMounted(() => {
  cityQuList.value = allCityList.value?.filter(
    (item) => item.name === preventCity.value
  )[0]?.subLevelModelList[0].subLevelModelList as [];
  getQu(preventCity.value)
  if (preventCity.value == "全国") {
    showQu.value = false;
  }
  getPositionData();
});
</script>

<style lang="less" scoped>
.userJob {
  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    margin-top: 25px;
    display: flex;
    justify-content: space-between;
    .left {
      width: 73%;
      .top {
        border-radius: var(--radiusSize);
        padding: 15px 22px;
        box-sizing: border-box;
        min-height: 190px;
        background: #fff;
        .exp {
          margin-top: 5px;
          span {
            font-size: 16px;
            font-weight: 500;
            color: #222;
            margin-right: 25px;
          }

          .hope_job {
            color: var(--themeColor);
            cursor: pointer;
            position: relative;
            margin-right: 50px;
            &::after {
              position: absolute;
              content: "";
              right: -25px;
              width: 1.5px;
              height: 12px;
              top: 50%;
              transform: translateY(-50%);
              background: #b8bbcc;
            }
          }
          .hope_job_others {
            transition: all 0.24s linear;
            cursor: pointer;
            position: relative;
            &::after {
              position: absolute;
              content: "";
              transition: all 0.24s linear;
              top: 56%;
              transform: translateY(-50%);
              right: -18px;
              border: 5px solid transparent;
              border-left: 5px solid #b8bbcc;
            }
            &:hover {
              &::after {
                border-left: 5px solid var(--themeColor);
              }
              color: var(--themeColor);
            }
          }
        }
        .tags {
          width: 100%;
          line-height: 44px;
          span {
            font-size: 16px;
            position: relative;
            font-weight: 500;
            color: var(--themeColor);
            cursor: pointer;
            &::after {
              content: " ";
              position: absolute;
              left: 0;
              right: 0;
              bottom: -7px;
              z-index: 1;
              height: 2.4px;
              background: var(--themeColor);
              border-radius: 2px;
            }
          }
        }
        .cityBox {
          width: 100%;
          min-height: 60px;
          background: #f8f8f8;
          margin-top: 6px;
          padding: 10px 14px 2px;
          box-sizing: border-box;
          display: flex;
          margin-top: 10px;
          justify-content: flex-start;
          flex-wrap: wrap;

          span {
            font-size: 14px;
            font-weight: 400;
            color: #333;
            margin-right: 15px;
            margin-bottom: 8px;
            transition: all 0.25s linear;
            cursor: pointer;
            &:hover {
              color: var(--themeColor);
            }
          }
          .quActive {
            color: var(--themeColor);
          }
        }
        .condition {
          width: 100%;
          height: 45px;
          margin: 12px auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .item {
            display: flex;
            .dropDownlist {
              margin-right: 16px;
            }
          }
          .clear {
            transition: all 0.25s linear;
            cursor: pointer;
            &:hover {
              color: var(--themeColor);
            }
          }
        }
        .search {
          margin: 0 auto;
          height: 80px !important;
          ::v-deep(.box) {
            width: 100% !important;
          }
          ::v-deep(.searchBtn) {
            width: 130px !important;
          }
        }
      }
      .list {
        border-radius: var(--radiusSize);
        margin-top: 20px;
        .pageNation {
          width: 100%;
          margin: 40px auto;
          // text-align: center;
          display: flex;
          justify-content: center;
        }
      }
    }
    .right {
      width: 25.5%;
      // background: #fff;
      border-radius: var(--radiusSize);
      .userCard {
        width: 100%;
        background: #fff;
        height: 195px;
        margin-bottom: 20px;
        border-radius: var(--radiusSize);
        padding: 10px 20px;
        box-sizing: border-box;
        .info {
          width: 100%;
          height: 60px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          box-sizing: border-box;
          .left {
            width: 47px;
            height: 47px;
            border-radius: 50%;
            img {
              border-radius: 50%;
              width: 100%;
            }
          }
          .right {
            flex: 1;
            margin-left: 12px;
            .top {
              font-size: 16px;
              color: #222;
            }
            .bottom {
              font-size: 12px;
              color: #666;
              span {
                margin-right: 24px;
                position: relative;
                &::after {
                  content: "";
                  position: absolute;
                  width: 1px;
                  height: 12px;
                  top: 51%;
                  right: -12px;
                  transform: translateY(-50%);
                  background: #e0e0e0;
                }
                &:last-child {
                  &::after {
                    display: none;
                  }
                }
              }
            }
          }
        }
        .btns {
          width: 100%;
          border-radius: var(--radiusSize);
          cursor: pointer;
          height: 38px;
          margin: 10px auto;
          transition: all 0.2s linear;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1px solid #d4d5d6;
          &:hover {
            color: var(--themeColor);
            border: 1px solid var(--themeColor);
          }
        }
        .sendInfo {
          width: 100%;
          height: 50px;
          display: flex;
          background: linear-gradient(90deg, #f5fcfc, #fcfbfa);
          justify-content: space-between;
          li {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            &:hover {
              .weight {
                color: var(--themeColor);
              }
            }
            span {
              font-size: 12px;
              color: #666;
              font-weight: 400;
            }
            .weight {
              font-size: 18px;
              font-family: kanzhun;
              color: #222;
              transition: all 0.1s linear;
            }
          }
        }
      }
      .resume {
        width: 100%;
        margin-bottom: 20px;
        border-radius: var(--radiusSize);
        min-height: 100px;
        background: #fff;
        .title {
          width: 100%;
          height: 46px;
          line-height: 46px;
          padding-left: 18px;
          box-sizing: border-box;
          font-size: 16px;
          font-weight: 500;
          color: #222;
          background: linear-gradient(90deg, #f5fcfc, #fcfbfa);
        }
        .resumeContent {
          padding: 10px 0;
          box-sizing: border-box;
          min-height: 100px;
          .list {
            padding: 0 5px;
            box-sizing: border-box;
            li {
              display: flex;
              justify-content: space-between;
              align-items: center;
              height: 40px;
              padding: 0 10px;
              box-sizing: border-box;
              transition: all 0.2s linear;
              cursor: pointer;
              &:hover {
                background: #f8f8f8;
              }
              span {
                &:first-child {
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  max-width: 194px;
                  color: #333;
                  font-size: 14px;
                }
                &:last-child {
                  .del {
                    background: #cccccc;
                  }
                }
              }
            }
          }
          .btns {
            width: 90%;
            border-radius: var(--radiusSize);
            cursor: pointer;
            height: 38px;
            margin: 10px auto;
            transition: all 0.2s linear;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid #d4d5d6;
            color: #fff;
            background: var(--themeColor);
            &:hover {
              background: var(--btnHoverThemeColor);
            }
          }
        }
      }
    }
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
.navbar{
  position: fixed !important;
  top: 0;
  left: 0 ;
  right: 0;
  z-index: 9999;

}
</style>
