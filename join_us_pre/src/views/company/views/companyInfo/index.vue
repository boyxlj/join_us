<template>
  <div class="companyInfo">
    <a-alert v-if="!companyState" style="margin: 20px; 0" type="error" closable message="您提交的公司信息审核未通过，可能呢涉及违规等，请重新修改后再次提交审核" banner />
    <a-button class="editor" type="primary"  @click="visible=true">编辑公司信息</a-button>
    <div
      class="selectCompany profileBox"
      v-for="item in selectCompanyData"
      :key="item.id"
    >
      <div class="infoLeft">
        <div class="items" v-if="item.company_introduction">
          <div class="infoTitle">公司Logo</div>
          <a-avatar shape="square" v-if="item.logo" :src="item.logo" :size="64">
          <template #icon><UserOutlined /></template>
        </a-avatar>
          <a-avatar shape="square" v-else  :size="64">
          <template #icon><UserOutlined /></template>
        </a-avatar>
        </div>
        <div class="items" v-if="item.company_introduction">
          <div class="infoTitle">公司简介</div>
          <p class="desc">
            {{ item.company_introduction }}
          </p>
        </div>
        <div class="items" v-if="photosList.length">
          <div class="infoTitle">公司相册</div>
          <div class="swiperBox">
            <a-carousel arrows :dots="false">
              <template #prevArrow>
                <div class="custom-slick-arrow arrowLeft" style=" left: -16px; z-index: 1">
                  <span class="arrow lef"></span>
                </div>
              </template>
              <template #nextArrow>
                <div class="custom-slick-arrow arrowRight" style="right: -8px">
                  <span class="arrow "></span>
                </div>
              </template>
              <div class="swiperItem" v-for="(item,index) in Math.ceil(photosList?.length/8)" :key="index" >
                <div class="img" v-for="(items,imgIndex) in [...photosList].splice(index*8,8)" :key="imgIndex">
                    <img  v-lazy="items.img" alt="">
                </div>
              </div>
            </a-carousel>
          </div>
        </div>
        <div class="items" v-if="item.development_history">
          <div class="infoTitle">发展历程</div>
          <p class="desc">
            {{ item.development_history }}
          </p>
        </div>
        <div class="items" v-if="item.development">
          <div class="infoTitle">人才发展</div>
          <p class="tagList">
            <span
              v-for="welfare in JSON.parse(item.development)"
              :key="welfare"
              >{{ welfare }}</span
            >
          </p>
        </div>
        <div class="items">
          <div class="infoTitle">工商信息</div>
          <div class="gsInfo">
            <li class="infoItem">
              <span class="tit">企业名称：</span>
              <span class="contents">{{
                item.company_name ? item.company_name : "-"
              }}</span>
            </li>
            <li class="infoItem">
              <span class="tit">法定代表人：</span>
              <span class="contents">{{
                item.legal_representative ? item.legal_representative : "-"
              }}</span>
            </li>
            <li class="infoItem">
              <span class="tit">成立时间：</span>
              <span class="contents">{{
                item.create_time ? getTime(item.create_time) : "-"
              }}</span>
            </li>
            <li class="infoItem">
              <span class="tit">所属行业：</span>
              <span class="contents">{{
                item.industry ? item.industry : "-"
              }}</span>
            </li>
            <li class="infoItem">
              <span class="tit">注册资本：</span>
              <span class="contents">{{
                item.capital ? item.capital : "-"
              }}</span>
            </li>
            <li class="infoItem">
              <span class="tit">所属地区：</span>
              <span class="contents">{{
                item.reg_city ? item.reg_city : "-"
              }}</span>
            </li>
            <li class="infoItem">
              <span class="tit">经营范围：</span>
              <span class="contents">{{
                item.business_scope ? item.business_scope : "-"
              }}</span>
            </li>
          </div>
        </div>
        <div class="items">
          <div class="infoTitle">公司地址</div>
          <p class="address">
            {{ item.detail_position ? item.detail_position : "-" }}
          </p>
        </div>
        <div class="items">
          <div class="infoTitle">工作时间及福利</div>
          <div class="workBox">
            <p class="time" v-if="item.work_time">
              {{ item.work_time ? item.work_time : "-" }}
            </p>
            <p class="xx" v-if="item.rest">{{ item.rest ? item.rest : "-" }}</p>
            <div class="welfare" v-if="item.company_welfare">
              <span
                v-for="welfare in JSON.parse(item.company_welfare)"
                :key="welfare"
                >{{ welfare }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <a-modal :footer="null" :width="1200" centered  :maskClosable="false" v-model:visible="visible" title="修改公司信息" >
      <EditorCompanyInfo :companyState="companyState" @closeModel="closeModel"/>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import EditorCompanyInfo  from "./editorCompanyInfo/index.vue"
import { ICompanyInfo } from "@/types/company";
import { getTime } from "@/utils/formatTime";
import { selCompanyPhoto } from "@/api";
import "md-editor-v3/lib/style.css";
import {UserOutlined} from "@ant-design/icons-vue";
import { useCompanyInfo } from "@/store/company_hr";
import {useCompanyState} from "@/hooks/useCompanyState"
const visible = ref(false)
const companyState = ref(true)
const selectCompanyData = computed(
  () => useCompanyInfo().companyInfoList as ICompanyInfo[]
);
const company_id = useCompanyInfo().company_id;
const photosList = ref<any[]>([]);

const closeModel = ()=>{
  visible.value = false
}
onMounted(async() => {
  getPhotos(company_id);
  const flag = await useCompanyState(true)
  if(flag.sateValue==2){
    companyState.value = false
  }
});



const getPhotos = async (company_id: string) => {
  const res: any = await selCompanyPhoto(company_id);
  if (res.code !== 200) {
    return (photosList.value = []);
  }
  photosList.value = res.data;
};
</script>

<style lang="less" scoped>
.companyInfo{
  position: relative;
  .editor{
    margin-left: 40px;
  }
}
.selectCompany,
.profileBox {
  padding: 15px 20px;
  box-sizing: border-box;
  width: 1100px;
  min-height: 400px;
  display: flex;
  justify-content: space-between;
  .infoLeft {
    width: 100%;
    height: 100%;
    background: #fff;
    padding: 20px 28px;
    box-sizing: border-box;
    background: #fff;
    border-radius: var(--radiusSize);
    .items {
      margin-bottom: 20px;
      .infoTitle {
        font-size: 18px;
        font-weight: 600;
        color: #222;
        margin-bottom: 10px;
      }
      .tagList {
        display: flex;
        flex-wrap: wrap;
        span {
          background: #f8f8f8;
          border-radius: 4px;
          padding: 4px 12px;
          font-size: 14px;
          color: #666;
          margin-right: 12px;
          margin-bottom: 10px;
        }
      }
      .gsInfo {
        width: 100%;
        min-height: 180px;
        background: #f8f8f8;
        border-radius: var(--radiusSize);
        padding: 20px;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        .infoItem {
          margin-right: 100px;
          margin-bottom: 40px;
          display: flex;
          flex-direction: column;
          .tit {
            font-size: 14px;
            color: #999;
            margin-bottom: 8px;
          }
          .contents {
            font-size: 15px;
            color: #333;
          }
        }
      }
      .swiperBox {
        border-radius: 12px;
        height:320px;
        width: 100%;
        &:hover {
          .ant-carousel :deep(.slick-arrow.custom-slick-arrow) {
            opacity: 1;
          }
        }
      }
      .desc {
        font-size: 15px;
        font-weight: 400;
        color: #333;
        line-height: 28px;
        max-height: 113px;
        overflow: hidden;
      }
      .welfare {
        display: flex;
        flex-wrap: wrap;

        span {
          background: #f8f8f8;
          border-radius: 4px;
          margin-left: 4px;
          margin-right: 4px;
          margin-top: 12px;
          padding: 4px 15px;
          font-size: 14px;
          color: #666;
          line-height: 20px;
          max-width: 100%;
          width: 114px;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          box-sizing: border-box;
        }
      }
    }
  }
}


::v-deep(.arco-carousel-indicator-wrapper-bottom) {
  background: none;
}
.ant-carousel :deep(.slick-slide) {
  text-align: center;
  height: 320px;
  line-height: 160px;
  overflow: hidden;
  .swiperItem{
    display: flex !important;
    flex-wrap: wrap;
  }
  .img{
    width: 245px!important;
    height: 150px!important;
    border-radius: 12px;
    overflow: hidden;
    margin-right: 6px;
    margin-bottom: 6px;
    img{
      width: 100%;
      height: 100%;
      cursor: pointer;
      object-fit: cover;
      transition: all .2s linear;
      &:hover{
        transform: scale(1.2);
      }
    }
  }
 
}

.ant-carousel :deep(.slick-arrow.custom-slick-arrow) {
  width:30px;
  height:60px;
  border-radius: 50px;
  background: #fff;
  top:50%;   
  transform: translateY(-50%);
  box-shadow: 0 16px 40px 0 rgba(153, 153, 153, 0.3);
  transition: all .2s linear;
  opacity: 0;
  &:hover{
    background:var(--themeColor);
    .arrow{
      border-left: 5.5px solid #fff !important
    }
    .arrowLeft{
      border-right: 5.5px solid #fff !important
    }
  }        
  .arrow{
    border: 5.5px solid transparent !important;
    border-left: 5.5px solid #848899 !important;
    position: absolute;
    top: 50%;
    transition: all .2s linear;
    left: 60%;
    display: inline-block;
    transform: translate(-50%,-50%);
  }
  .lef{
    left: 20%;
    top: 44%;
   transform: rotate(180deg) !important;
  }
  &:hover{
    opacity: 1;
  }

  
}


.ant-carousel :deep(.custom-slick-arrow:before) {
  display: none;
}
.ant-carousel :deep(.custom-slick-arrow:hover) {
  opacity: 0.5;
}

.ant-carousel :deep(.slick-slide h3) {
  color: #fff;
}
</style>
