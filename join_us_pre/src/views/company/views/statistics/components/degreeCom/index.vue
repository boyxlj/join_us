<template>
  <div>
    <a-radio-group class="tagList" @change="changeTag" v-model:value="tagValue">
        <a-radio-button  value="hr">您发布的数据</a-radio-button>
        <a-radio-button value="company">公司数据</a-radio-button>
      </a-radio-group>
    <div ref="echartsDom" style="width: 600px; height: 400px"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { IDegreesDatum } from "@/types/statistics";
const props = defineProps<{ degreeRes: IDegreesDatum[],companyDegreeRes:IDegreesDatum[] }>();
const echartsDom = ref<HTMLDivElement>();
const degreeData = ref<{ num: number; name: string }[]>([]);
const tagValue = ref('hr')
const changeTag = ()=>{
  if(tagValue.value=='company'){
    setData(props.companyDegreeRes)
  }else{
    setData(props.degreeRes)
  }
}



const setData = (data:IDegreesDatum[])=>{
  const getData = (value: string) => {
      return (
        data?.filter((item) => item.degrees === value)?.length || 0
      );
    };
    degreeData.value = [
      {
        num: getData("学历不限"),
        name: "学历不限",
      },
      {
        num: getData("初中及以下"),
        name: "初中及以下",
      },
      {
        num: getData("中专/中技"),
        name: "中专/中技",
      },
      {
        num: getData("高中"),
        name: "高中",
      },
      {
        num: getData("大专"),
        name: "大专",
      },
      {
        num: getData("本科"),
        name: "本科",
      },
      {
        num: getData("硕士"),
        name: "硕士",
      },
      {
        num: getData("博士"),
        name: "博士",
      },
    ];
    getInitEcharts(
      degreeData.value?.map((item) => item.name),
      degreeData.value?.map((item) => item.num)
    );

}
watch(
  () => props.degreeRes,
  () => {
    setData(props.degreeRes)
  }
);

const getInitEcharts = (xData: string[], yData: number[]) => {
  var myChart = echarts.init(echartsDom.value as HTMLDivElement);
  // 绘制图表

  const option = {
    title: {
      text:tagValue.value=='hr'?"您发布的职位学历分布情况": "公司所有员工发布职位学历分布情况",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        data: xData,
        triggerEvent: true,
        // axisTick: {
        //   alignWithLabel: true,
        // },axisLabel: {
        axisLabel: {
          rotate: -25,
          // formatter: (val:any) => {
          //   let txt = val
          //   if (val.length > 3) {
          //     txt = val.substr(0, 3) + '...'
          //   }
          //   return txt
          // }}
        },
      },
    ],
    yAxis: [
      {
        type: "value",
      },
    ],
    series: [
      {
        name: "数量",
        type: "bar",
        barWidth: "60%",
        data: yData,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#83bff6" },
            { offset: 0.5, color: "#188df0" },
            { offset: 1, color: "#188df0" },
          ]),
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
