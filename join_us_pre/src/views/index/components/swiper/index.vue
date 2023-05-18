<template>
  <div class="swiperCom" @mouseleave="mouseleaveBox">
    <div class="jobList">
      <li
        @mouseenter="mouseenter(item.position_type_id,)"
        v-for="item in data?.slice(0, 7)"
        :key="item.position_type_id"
        :class="activeKey === item.position_type_id ? 'actives' : ''"
      >
        <p class="weight">{{ item.position_type_name }}</p>
        <span  @click="navigateJob(item.position_type_id)" v-for="item1 in item.children?.slice(0, 2)" :key="item1.id">{{
          item1.type_name
        }}</span>
        <p class="arrow"><span></span></p>
      </li>
    </div>

    <div @mouseleave="leaveShowBox" class="showBox" v-show="showBox">
      <div class="tags">
          <span @click="navigateJob(item.position_type_id)" v-for="item in showBoxData" :key="item.id">{{
            item.type_name
          }}</span>
        </div>
    </div>
    <div class="swiperBox">
      <a-carousel arrows autoplay :after-change="onChange">
        <template #prevArrow>
          <div class="custom-slick-arrow" style="left: 10px; z-index: 1">
            <left-circle-outlined />
          </div>
        </template>
        <template #nextArrow>
          <div class="custom-slick-arrow" style="right: 10px;z-index: 1">
            <right-circle-outlined />
          </div>
        </template>
        <div @click="navigateLinks(item.links)" v-for="(item,index) in swiperList" :key="index">
          <img :src="item.imgUrl" />
        </div>
      </a-carousel>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons-vue";
import { useJobTypeStore } from "@/store/positionType";
import {IPositionType1,IPositionTypeChild} from "@/types/jobType"
import { useSwiperStore } from "@/store/swiper";
type TSwiperData = {
  id:number,
  imgUrl:string,
  links:string
}
const swiperList = computed(()=>useSwiperStore().swiperList as TSwiperData[])
//跳转轮播链接
const navigateLinks=  (links:string)=>{
  const reg= /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i
  if(reg.test(links)){
    window.open(links)
  }
}
const router = useRouter()
const onChange = (current: number) => {
  // console.log(current);
};

const showBox = ref(false);

const data = ref<IPositionType1[]>([]);
const showBoxData = ref<IPositionTypeChild[]>([]);
//获取职位类型
const store = useJobTypeStore();
data.value = store.positionTypeList;

const activeKey = ref<string>("");
const mouseenter = (id: string) => {
  showBox.value = true;
  activeKey.value = id;
  showBoxData.value = data.value?.filter((item) => item.position_type_id == id)[0]?.children;
};

const navigateJob = (id:string)=>{
  router.push(
    `/home/job?position_type1=${activeKey.value}&position_type2=${id}`
  );
}

const leaveShowBox = () => {
  showBox.value = false;
};
const mouseleaveBox = () => {
  showBox.value = false;
  activeKey.value = "";
};
</script>

<style lang="less" scoped>
.swiperCom {
  height: 320px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;

  .jobList {
    width: 30%;
    height: 100%;
    background: #fff;
    border-radius: var(--radiusSize);
    padding: 7px 4px;
    box-sizing: border-box;
    .actives {
      box-shadow: 0 4px 16px 0 rgba(153, 153, 153, 0.2);
      .arrow {
        span {
          border-left: 5px solid var(--themeColor);
        }
      }
    }
    li {
      display: flex;
      height: 44px;
      align-items: center;
      transition: all 0.3s;
      padding: 0 8px 0 16px;
      box-sizing: border-box;
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      border-radius: var(--radiusSize);
      position: relative;
      box-sizing: border-box;
      &:hover {
        cursor: pointer;
        box-shadow: 0 4px 16px 0 rgba(153, 153, 153, 0.2);
        .arrow {
          span {
            border-left: 5px solid var(--themeColor);
          }
        }
      }
      span {
        color: #666;
        font-size: 14px;
        margin-right: 18px;
        transition: all 0.2s;
        cursor: pointer;
        &:hover {
          color: var(--themeColor);
        }
      }
      .weight {
        margin: 0;
        font-size: 16px;
        margin-right: 22px;
      }
      .arrow {
        margin: 0;
        position: absolute;
        right: 12px;
        width: 10px;
        span {
          transition: all 0.2s;
          display: inline-block;
          border: 5px solid transparent;
          border-left: 5px solid #cbcbcb;
        }
      }
    }
  }
  .swiperBox {
    flex: 1;
    width: 68%;
    margin-left: 15px;
    height: 100%;
    background: #fff;
    border-radius: var(--radiusSize);
    overflow: hidden;
    cursor: pointer;
    ::v-deep(.slick-slide) {
      text-align: center;
      height: 320px;
      overflow: hidden;
      div {
        height: 100%;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: var(--radiusSize);
        }
      }
    }
    ::v-deep(.slick-dots) {
      display: flex;
      position: relative;
      left: -90px;
      bottom: 20px;
      justify-content: flex-start;
    }
    ::v-deep(.slick-arrow.custom-slick-arrow) {
      width: 30px;
      height: 30px;
      font-size: 30px;
      color: #fff;
      color: var(--themeColor);
      transition: ease all 0.3s;
      opacity: 0.3;
      z-index: -1;
    }
    ::v-deep(.slick-arrow.custom-slick-arrow:before) {
      display: none;
    }
    ::v-deep(.slick-arrow.custom-slick-arrow:hover) {
      color: #fff;
      color: var(--themeColor);
      opacity: 0.5;
    }
    ::v-deep(.slick-active){
      button{
        background: var(--themeColor);
      }
      color: var(--themeColor);
    }

  }

  .showBox {
    width: 830px;
    background: #fff;
    position: absolute;
    right: 0;
    z-index: 99;
    bottom: 0;
    height: 320px;
    box-shadow: 0 10px 40px 0 rgba(153, 153, 153, 0.2);
    border: 1px solid #ebeef5;
    border-radius: var(--radiusSize);
    padding: 15px 25px;
    box-sizing: border-box;
    z-index: 88;
    overflow-y: auto;
    p {
      margin-bottom: 10px;
      font-size: 18px;
    }
    .tags {
      display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;
      span {
        margin-right: 30px;
        line-height: 40px;
        cursor: pointer;
        transition: all 0.2s;
        &:hover {
          color: var(--themeColor);
        }
      }
    }
  }
}
</style>
