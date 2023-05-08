<template>
  <div class="jobVacancy">
    <div class="select">
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

    <div class="contentBox">
      <div class="left">
        <positionList v-if="positionData.length" :positionData="positionData" />
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
      <div class="right">
        <positionCard />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import positionCard from "@/components/common/positionCard/index.vue";
import positionList from "../positionList/index.vue";
import DropDownlist from "@/components/common/dropDownlist/index.vue";
import Empty from "@/components/common/empty/index.vue";
import { message } from "ant-design-vue";
import { useCity } from "@/store/city";
import { useUserLoginState } from "@/hooks/useUserLoginState";
import { useGetConditionData } from "@/store/condition";
import { selectCompanysPositions } from "@/api";
const route = useRoute();
const { hotCityList, allCityList, preventCity } = useCity();
const keyName = ["cityName", "experiences", "degrees", "salary"];
const keyword = ref(route.query.keyword as string);
const position_type1 = ref(route.query.position_type1 as string);
const position_type2 = ref(route.query.position_type2 as string);
let condition: any = useGetConditionData();

const pageNationParams = reactive({
  pageOn: 1,
  pageSize: 30,
  total: 0,
});

onMounted(() => {
  getData();
});

const getClickValue = (val: string, idx: number) => {
  for (let item in formData) {
    if (item.includes(idx + "")) {
      formData[item] = val;
    }
  }
  pageNationParams.pageOn = 1;
  //发送请求
  getData();
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
  getData();
};

const positionData = ref([]);
//获取数据
const getData = async () => {
  const newObj: any = {};
  for (let i in formData) {
    newObj[keyName[(i.slice(5) as any) * 1]] = formData[i];
  }
  const params = {
    company_id: route.query.company_id,
    keyword: keyword.value,
    ...newObj,
    position_type1: position_type1.value,
    position_type2: position_type2.value,
    ...pageNationParams,
  };

  for (let item in params) {
    if (params[item] == "不限" || !params[item]) {
      delete params[item];
    }
  }

  console.log(params)
  const res: any = await selectCompanysPositions(params);
  console.log(res);
  if (res.code !== 200) {
    positionData.value = [];
    message.error("服务异常");
  } else {
    pageNationParams.total = res.total;
    positionData.value = res.data;
  }

  if (res.workCities.length) {
    const dat = res.workCities.map((item: string, index: number) => ({
      code: index + 1,
      name: item,
    }));
    if(conditions.value[0].length===1){
      conditions.value[0] = [...conditions.value[0], ...dat];
    }
  }

};

const changePageNation = (page: number, pageSize: number) => {
  pageNationParams.pageOn = page;
  document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
  getData();
};
const formData = reactive<any>({
  value0: "不限",
  value1: "不限",
  value2: "不限",
  value3: "不限",
});
const showValues = ref(["工作城市", "经验要求", "学历要求", "薪资待遇"]);


 const conditions = ref([
  [{code:0,name:"不限"}],
  condition.conditionData[1],
  condition.conditionData[3],
  condition.conditionData[2],
]);
const conditionData = ref(conditions.value);
</script>

<style lang="less" scoped>
.jobVacancy {
  width: 1200px;
  min-height: 300px;
  margin: 0 auto;
  .select {
    height: 70px;
    margin-top: 20px;
    background: #fff;
    border-radius: var(--radiusSize);
    width: 100%;
    margin-top: 10px;
    display: flex;
    padding: 10px 15px;
    box-sizing: border-box;
    justify-content: space-between;
    display: flex;
    align-items: center;
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
  .contentBox {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;

    .left {
      width: 886px;
      min-height: 100px;
      ::v-deep(.items) {
        &:hover {
          box-shadow: 0 16px 40px 0 rgba(153, 153, 153, 0.3) !important ;
        }
        background: #fff;
      }
      .pageNation {
        width: 100%;
        margin: 40px auto 70px;
        display: flex;
        justify-content: center;
      }
    }
    .right {
      width: 290px;
      min-height: 100px;
    }
  }
}
</style>
