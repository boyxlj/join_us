<template>
  <div class="consult">
    <div class="top">
      <p>实时资讯和数据实时跟踪</p>
    </div>
    <div class="content">
      <div class="nav">
        <li @click="changeNav(item.id)" :class="activeIdx===item.id?'activeLi':''"  v-for="(item,index) in categoryList" :key='index'>
          <span class="iconBox">
            <component  class="icon" :is="iconList[item.id]"/>
            </span>
          {{item.categoryName}}</li>
      </div>
    <div class="list">
      <ConsultListComponent :consultData="consultData" v-if="consultData.length" />
      <Empty v-else msg="当前资讯分类下暂无数据" />
    </div>
    <a-pagination
        @change="changePageNation"
        :pageSize="formPageNation.pageSize"
        v-model:current="formPageNation.pageOn"
        :total="total"
        show-less-items
        class="pageNation"
        v-if="consultData.length"
        :disabled="loading"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {FundOutlined,CompassOutlined,InboxOutlined,
   ContainerOutlined,
   NotificationOutlined } from '@ant-design/icons-vue';
import {selectConsult} from "@/api"
import ConsultListComponent from "./components/consultList/index.vue"
import {useConsult} from "@/store/consult"
import {IConsultData} from "@/types/consult"
import Empty from "@/components/common/empty/index.vue";
const router = useRouter()
const route = useRoute()
const {consultCategoryData} = useConsult()
const categoryList = [
  {id: 4, categoryName: '全部资讯'},
  ...consultCategoryData,
]
const formPageNation = reactive({
  pageOn: 1,
  pageSize: 15,
});
const total = ref(0)
const consultData = ref<IConsultData[]>([])

onMounted(() => {
  if (!route.query.tag) {
    router.push(`/home/consult?tag=${4}`);
  } else {
    activeIdx.value = (route.query.tag as any) * 1;
  }
  getData()
});

watch(
  () => route.fullPath,
  () => {
    activeIdx.value = (route.query.tag as any) * 1;
  }
);
const activeIdx = ref(4)

const changeNav = (id:number)=>{
  formPageNation.pageOn = 1
  activeIdx.value = id
  router.push(`/home/consult?tag=${id}`);
  getData()
}
const changePageNation = (page: number, pageSize: number) => {
  formPageNation.pageOn = page;
  document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
  getData();
};
const loading=ref(false)
const getData = async ()=>{
  let params:any = { ...formPageNation}
  loading.value = true
  if(activeIdx.value===4){
    params = {...params,category:''}
  }else{
    params = {...params,category:categoryList[activeIdx.value].categoryName}
  }
  const res:any = await selectConsult(params).finally(()=>{loading.value = false})
  if(res.code!==200){
    return consultData.value=[]
  }
  consultData.value=res.data
  total.value=res.total
}

const iconList = [
  ContainerOutlined,    // 求职必读
  FundOutlined,      // 数据报告
  InboxOutlined,     // 干货文章 FundOutlined
  CompassOutlined,     // 公司动态
  NotificationOutlined,    //全部资讯
  
]

</script>

<style lang="less" scoped>
.consult {
  .top {
    height: 240px;
    background: url(https://img.bosszhipin.com/static/file/2022/lmmi44x97d1667814225827.jpg)
      center 0 no-repeat #3d4f5e;
    -webkit-background-size: cover;
    background-size: cover;
    position: relative;
    p {
      font-size: 36px;
      font-weight: 500;
      color: #fff;
      position: absolute;
      top: 32%;
      left: 50%;
      text-align: center;
      transform: translate(-50%,-50%);
      line-height: 50px;
    }
  }
  .content{
    width: 1200px;
    min-height: 400px;
    margin: 0 auto;
    padding: 0 60px;
    position: relative;
    top: -100px;
    box-sizing: border-box;
    .nav{
      height: 68px;
      width: 100%;
      border-radius: 10px;
      background: #fff;
      padding: 10px 66px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      li{
        height: 100%;
        display: flex;
        align-items: center;
        font-size: 16px;
        cursor:pointer;
        transition:all .2s linear;
        .iconBox{
          height: 36px;
          width: 36px;
          border-radius: 10px;
          padding: 5px;
          box-sizing: border-box;
          display: inline-block;
          margin-right: 8px;
          text-align: center;
          background: #F8F8F8;
          transition:all .15s linear;
          .icon{
            transition:all .15s linear;
          }
        }
        &:hover{
          color: var(--themeColor);
          .iconBox{
            background: var(--themeColor);
            .icon{
              color:#fff
            }
          }
        }

      }
      .activeLi{
        color: var(--themeColor);
          .iconBox{
            background: var(--themeColor);
            .icon{
              color:#fff
            }
          }
      }
    }
    .list{
      margin-top: 23px;
    }
    .pageNation{
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 60px;
    }
  }
}
</style>
