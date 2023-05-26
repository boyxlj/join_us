<template>
   <div>
    <a-radio-group class="tagList" @change="changeTag" v-model:value="tagValue">
        <a-radio-button value="hr">您发布的数据</a-radio-button>
        <a-radio-button value="company">公司数据</a-radio-button>
      </a-radio-group>
  <div ref="echartsDom" style="width: 600px; height: 400px"></div>
</div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { ISendDatum } from "@/types/statistics";
const props = defineProps<{ sendRes: ISendDatum[],companySendRes: ISendDatum[]}>();
const echartsDom = ref<HTMLDivElement>();
type TEchartsData = { value: number; name: string };
const tagValue = ref('hr')
const changeTag = ()=>{
  if(tagValue.value=='company'){
    console.log(props.companySendRes)
    setData(props.companySendRes)
  }else{
    setData(props.sendRes)
  }
}

const setData = (data:ISendDatum[])=>{
  const arr: TEchartsData[] = [];
    const obj: any = {
      resolve: 0,
      reject: 0,
      sh: 0,
    };
    if (data.length) {
      data?.forEach((item) => {
        if (item.types == "0") {
          obj.sh = obj.sh += 1;
        } else if (item.types == "1") {
          obj.resolve = obj.resolve += 1;
        } else if (item.types == "2") {
          obj.reject = obj.reject += 1;
        }
      });
    }

    for (let i in obj) {
      if (i == "resolve") {
        arr.push({ name: "已约面试", value: obj[i] });
      } else if (i == "reject") {
        arr.push({ name: "不合适", value: obj[i] });
      } else {
        arr.push({ name: "未处理", value: obj[i] });
      }
    }
    getInitEcharts(arr);
}

watch(
  () => props.sendRes,
  () => {
    setData(props.sendRes)
  }
);

const getInitEcharts = (value: TEchartsData[]) => {
  var myChart = echarts.init(echartsDom.value as HTMLDivElement);
  // 绘制图表

  const option = {
    title: {
      text: tagValue.value=='hr'?"您收到的简历投递情况":"公司所有员工收到的简历投递情况",
      left: "center",
    },

    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: "当前数值",
        type: "pie",
        radius: "50%",
        data: value,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  myChart.setOption(option);
};
onMounted(() => {});
</script>

<style lang="less" scoped>
.tagList{
  position: absolute;
  z-index: 99;
  top: -55px;

}
.ant-radio-button-wrapper{
  &:first-child{
    border-radius: 5px 0 0 5px;
  }
  &:last-child{
    border-radius: 0 5px  5px 0;
  }
}
</style>
