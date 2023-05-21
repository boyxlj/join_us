<template>
  <div class="companyDetail">
    <div class="top">
      <div class="container">
        <div class="companyInfo">
          <div class="logo">
            <img :src="companyDetailData?.companyInfo[0]?.logo" alt="">
          </div>
          <div class="info">
            <p class="companyName">{{ companyDetailData.companyInfo[0]?.company_name }}</p>
            <p class="companyOther">
              <span>{{ companyDetailData.companyInfo[0]?.financing?companyDetailData.companyInfo[0]?.financing:'未融资' }}</span>· <span>{{ companyDetailData.companyInfo[0]?.people_num }}</span>·
              <span>{{ companyDetailData.companyInfo[0]?.industry }}</span>
            </p>
          </div>
        </div>
        <div class="allPosition">
          <p class="pos" @click="changeActive(1)"><span>{{ companyDetailData.positionCount }}</span>在招职位</p>
          <p class="boss"><span>{{ companyDetailData.bossCount }}</span>位BOSS</p>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="tagNav">
        <li
          @click="changeActive(0)"
          :class="activeIdx === 0 ? 'tagNavActive' : ''"
        >
          公司简介
        </li>
        <li
          @click="changeActive(1)"
          :class="activeIdx === 1 ? 'tagNavActive' : ''"
        >
          招聘职位({{ companyDetailData.positionCount }})
        </li>
      </div>

      <CompanyProfile :companyDetailData="companyDetailData" v-show="activeIdx===0"/>
      <JobVacancy :companyDetailData="companyDetailData" v-show="activeIdx===1"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import CompanyProfile from "./components/companyProfile/index.vue"
import JobVacancy from "./components/jobVacancy/index.vue"
import {ICompanyDetailData} from "@/types/company"
import {selectCompanysDetail} from "@/api"
import { message } from "ant-design-vue";
const route = useRoute();
const router = useRouter();
onMounted(() => {
  if (!route.query.tag) {
    router.push(`${route.fullPath}&tag=0`);
    activeIdx.value = 0;
  } else {
    activeIdx.value = (route.query.tag as any) * 1;
  }
  getCompanyDetails()
});

const companyDetailData = reactive<ICompanyDetailData>({
  bossCount:0,
  positionCount:0,
  companyInfo:[],
  companyPhotos:[],
  posData:[],
})
const getCompanyDetails = async()=>{
  const res:any = await selectCompanysDetail(route.query.company_id as string)
  if(res.code!==200){
    message.error("服务异常")
    // router.replace("/notfound")
    return 
  }else{
    companyDetailData.bossCount = res.bossCount
    companyDetailData.positionCount = res.positionCount
    companyDetailData.companyInfo = res.companyInfo
    companyDetailData.companyPhotos = res.companyPhotos
    companyDetailData.posData = res.posData
  }
  if(res.companyInfo[0]?.state!='1'){
    // router.replace("/notfound")
  }
  if(res.companyInfo[0]?.company_name){
    document.title =res.companyInfo[0]?.company_name
  }
}

watch(()=>route.fullPath,()=>{
    activeIdx.value =(route.query.tag as any) *1
})

const activeIdx = ref(0);
const changeActive = (idx: number) => {
  activeIdx.value = idx;
  if (!route.query.tag) {
    router.push(`${route.fullPath}&tag=${idx}`);
  } else {
    router.push(
      `/home/companyDetail?company_id=${route.query.company_id}&tag=${idx}`
    );
  }
};
</script>

<style lang="less" scoped>
.companyDetail {
  .top {
    width: 100%;
    height: 160px;
    background-image: linear-gradient(90deg, #3b526a 0, #345a6d 100%);
    padding: 30px 0;
    .container {
      width: 1200px;
      margin: 0 auto;
      color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100px;
      p {
        margin: 0;
      }
      .companyInfo {
        display: flex;
        .logo {
          width: 100px;
          height: 100px;
          border-radius: 10px;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .info {
          margin-left: 22px;
          .companyName {
            font-size: 36px;
            font-weight: 600;
            color: #fff;
          }
          .companyOther {
            font-size: 15px;
            font-weight: 400;
            margin-top: 8px;
          }
        }
      }
      .allPosition {
        display: flex;
        p {
          margin-left: 30px;
          font-size: 15px;
          span {
            font-size: 36px;
            font-weight: 400;
            margin-right: 6px;
          }
        }
        .pos{
          cursor: pointer;
        }
      }
    }
  }
  .content {
    width: 1200px;
    margin: 22px auto;
    .tagNav {
      height: 50px;
      border-radius: var(--radiusSize);
      background: #fff;
      padding: 0 30px;
      box-sizing: border-box;
      display: flex;
      align-items: center;

      li {
        cursor: pointer;
        font-size: 18px;
        margin-right: 30px;
        transition: all 0.2s linear;
        &:hover {
          color: var(--themeColor);
        }
      }
      .tagNavActive {
        color: var(--themeColor);
        position: relative;
        transition: all 0.2s linear;
        &::after {
          position: absolute;
          content: "";
          width: 35px;
          height: 2px;
          background: var(--themeColor);
          bottom: -10px;
          left: 50%;
          border-radius: var(--radiusSize);
          transform: translateX(-50%);
        }
      }
    }
  }
}
</style>
