<template>
  <div class="companyProfile">
    <div class="hotPosition" v-if="companyDetailData.positionCount">
      <div class="tops" >
        <li class="title">热招职位</li>
        <li class="alls" @click="navigateTag1" >
          查看全部{{companyDetailData.positionCount}}个职位<span></span>
        </li>
      </div>
      <div class="list" >
        <div class="item" @click="navigatePosDetails(item.position_id)" v-for="item in companyDetailData.posData?.slice(0,3)" :key="item.id">
          <div class="itemTop">
            <span class="posName">{{item.position_name}}</span>
            <span class="salary">{{item.salary}}</span>
          </div>
          <div class="itemBottom">
            <li class="others">
              <span>{{ item.experiences }}</span>
              <span>{{ item.degrees }}</span>
            </li>
            <span class=city>{{ item.cityName }}</span>
          </div>
          <a-button type="primary" class="connect" @click.stop="sendPos(item.position_id,item.company_id)">立即投递</a-button>
          <div class="hoverBox">
            <div class="hoverBoxTitle" v-if="item.welfare_tag">福利</div>
            <div class="tagData" v-if="item.welfare_tag">
              <span v-for="(welfare,index) in JSON.parse(item.welfare_tag)" :key="index">{{ welfare }}</span>
            </div>
            <div class="hoverBoxTitle" >职位描述</div>
            <div class="posDesc" >
              {{ item.position_desc }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="profileBox" v-for="item in companyDetailData.companyInfo" :key="item.id">
      <div class="infoLeft">
        <div class="items" v-if="item.company_introduction">
          <div class="infoTitle">公司简介</div>
          <p class="desc">
            {{ item.company_introduction }}
          </p>
        </div>
        <div class="items" v-if="companyDetailData.companyPhotos.length">
          <div class="infoTitle">公司相册</div>
          <div class="swiperBox">
            <a-carousel arrows :dots="false">
              <template #prevArrow>
                <div class="custom-slick-arrow arrowLeft" style=" left: -13px; z-index: 1">
                  <span class="arrow lef"></span>
                </div>
              </template>
              <template #nextArrow>
                <div class="custom-slick-arrow arrowRight" style="right: -13px">
                  <span class="arrow "></span>
                </div>
              </template>
              <div class="swiperItem" v-for="(item,index) in Math.ceil(companyDetailData.companyPhotos?.length/8)" :key="index" >
                <div class="img" v-for="(items,imgIndex) in [...companyDetailData.companyPhotos].splice(index*8,8)" :key="imgIndex">
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
            
            <span v-for="welfare in JSON.parse(item.development)" :key="welfare">{{ welfare }}</span>
          </p>
        </div>
        <div class="items">
          <div class="infoTitle">工商信息</div>
          <div class="gsInfo">
            <li class="infoItem">
              <span class="tit">企业名称：</span>
              <span class="contents">{{ item.company_name?item.company_name:'-'}}</span>
            </li>
            <li class="infoItem">
              <span class="tit">法定代表人：</span>
              <span class="contents">{{ item.legal_representative?item.legal_representative:'-' }}</span>
            </li>
            <li class="infoItem">
              <span class="tit">成立时间：</span>
              <span class="contents">{{ item.create_time?getTime(item.create_time):'-' }}</span>
            </li>
            <li class="infoItem">
              <span class="tit">所属行业：</span>
              <span class="contents">{{ item.industry?item.industry:'-' }}</span>
            </li>
            <li class="infoItem">
              <span class="tit">注册资本：</span>
              <span class="contents">{{ item.capital?item.capital:'-' }}</span>
            </li>
            <li class="infoItem">
              <span class="tit">所属地区：</span>
              <span class="contents">{{ item.reg_city?item.reg_city:'-' }}</span>
            </li>
            <li class="infoItem">
              <span class="tit">经营范围：</span>
              <span class="contents">{{ item.business_scope?item.business_scope:'-' }}</span>
            </li>
          </div>
        </div>
        <div class="items">
          <div class="infoTitle">公司地址</div>
          <p class="address">{{ item.detail_position?item.detail_position:'-'  }}</p>
        </div>
  
      </div>
      <div class="infoRight">
        <div class="workTimeBox">
          <div class="workTitle">工作时间及福利</div>
          <div class="workBox" >
            <p class="time" v-if="item.work_time">{{ item.work_time?item.work_time:'-' }}</p>
            <p class="xx" v-if="item.rest">{{ item.rest?item.rest:'-' }}</p>
            <div class="welfare" v-if="item.company_welfare">
              <span v-for="welfare in JSON.parse(item.company_welfare)" :key="welfare">{{ welfare }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="hotPosition otherPosition" v-if="companyDetailData.positionCount">
      <div class="tops">
        <li class="title">在招职位</li>
        <li class="alls" @click="navigateTag1">
          查看全部{{companyDetailData.positionCount}}个职位<span></span>
        </li>
      </div>
      <div class="positionList">
        <PositionList :positionData="companyDetailData.posData" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PositionList from "../positionList/index.vue"
import {ICompanyDetailData} from "@/types/company"
import {addSend} from "@/api"
import {useUserInfo} from "@/store/user"
import {message} from 'ant-design-vue'
import {useUserLoginState} from "@/hooks/useUserLoginState"
import { useValidateResume } from "@/hooks/useValidateResume";
import {getTime} from "@/utils/formatTime"
const {userId} = useUserInfo()
defineProps<{companyDetailData:ICompanyDetailData}>()
const router = useRouter();
const route = useRoute();
const navigateTag1 = () => {
  router.push(`/home/companyDetail?company_id=${route.query.company_id}&tag=1`);
};
//跳转详情
const navigatePosDetails = (position_id:string)=>{
  window.open(`/home/jobDetail?position_id=${position_id}`)
}
const sendPos = async(position_id:string,company_id:string)=>{
  if(!useUserLoginState()) return
  if (!useValidateResume()) return;
  const res:any = await addSend({userId,position_id,company_id})
  if(res.code!==200) return message.error(res.msg)
  message.success("投递成功")
}

</script>

<style lang="less" scoped>
.companyProfile {
  .hotPosition {
    min-height: 185px;
    padding: 20px 28px;
    box-sizing: border-box;
    background: #fff;
    border-radius: var(--radiusSize);
    margin-top: 20px;
    .tops {
      margin-bottom: 16px;
      padding-bottom: 0;
      line-height: 25px;
      display: flex;
      justify-content: space-between;

      .title {
        font-size: 18px;
        font-weight: 600;
        color: #222;
      }
      .alls {
        font-size: 15px;
        color: var(--themeColor);
        cursor: pointer;
        span {
          margin-left: 8px;
          position: relative;
          top: -1px;
          display: inline-block;
          border: 5px solid transparent;
          border-left: 5px solid var(--themeColor);
        }
      }
    }
    .list {
      width: 100%;
      height: 110px;
      display: flex;
      justify-content: flex-start;

      .item {
        width: 368px;
        height: 94px;
        padding: 20px;
        margin-right: 10px;
        border: 1px solid #ededed;
        background: #fff;
        border-radius: 12px;
        box-sizing: border-box;
        transition: all 0.2s linear;
        cursor: pointer;
        position: relative;
        &:hover {
          border: 1px solid transparent;
          background: #f8f8f8;
          .connect {
            opacity: 1;
          }
          .hoverBox {
            display: block;
            .hoverBoxTitle{
              font-size: 16px;
              font-weight: 500;
              color: #222;
              line-height: 22px;
              margin: 0 0 12px;
            }
            .tagData{
              display: flex;
              flex-wrap: wrap;
              margin-bottom: 15px;
              span{
                background: #f7f7f7;
                border-radius: 4px;
                padding: 4px 12px;
                border: none;
                height: auto;
                font-size: 14px;
                color: #666;
                line-height: 20px;
                float: left;
                margin-right: 8px;
                margin-bottom: 8px;
                transition: all .2s linear;
              }
            }
          }
          .itemBottom{
            .others{
              span{
                background: #ECECEC;
              }
            }
            .city{
              opacity: 0;
            }

          }
        }
        .itemTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          top: -4px;
          .posName {
            display: inline-block;
            font-size: 16px;
            font-weight: 500;
            max-width: 190px;
            transition: all 0.2s linear;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            color: var(--themeColor);
          }
          .salary {
            font-size: 20px;
            font-family: kanzhun-Regular, kanzhun;
            color: #fe574a;
            line-height: 24px;
          }
        }
        .itemBottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 7px;
          .others {
            span {
              background: #f8f8f8;
              border-radius: 4px;
              padding: 2px 8px;
              font-size: 13px;
              color: #666;
              margin-right: 10px;
              transition: all 0.2s linear;
            }
          }
          .city{
            transition: all 0.2s linear;
            opacity:1
          }
        }
        .connect {
          position: absolute;
          right: 20px;
          bottom: 15px;
          opacity: 0;
          transition: all 0.1s linear;
        }
        .hoverBox {
          position: absolute;
          width: 130%;
          min-height: 300px;
          padding: 20px 20px;
          box-sizing: border-box;
          background: #fff;
          left: 50%;
          top: 100%;
          z-index: 999;
          transform: translateX(-50%);
          border-radius: var(--radiusSize);
          box-shadow: 0 16px 40px 0 rgba(153, 153, 153, 0.3);
          display: none;
        }
      }
    }
  }
  .profileBox {
    width: 100%;
    min-height: 400px;
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    .infoLeft {
      width: 880px;
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
        .tagList{
          display: flex;
          flex-wrap: wrap;
          span{
            background: #f8f8f8;
            border-radius: 4px;
            padding: 4px 12px;
            font-size: 14px;
            color: #666;
            margin-right: 12px;
            margin-bottom: 10px;
          }
        }
        .gsInfo{
          width: 100%;
          min-height:180px ;
          background: #F8F8F8;
          border-radius: var(--radiusSize);
          padding: 20px;
          box-sizing: border-box;
          display:flex;
          flex-wrap: wrap;
          .infoItem{
            margin-right: 100px;
            margin-bottom: 40px;
            display: flex;
            flex-direction: column;
            .tit{
              font-size: 14px;
              color: #999;
              margin-bottom: 8px;
            }
            .contents{
              font-size: 15px;
              color: #333;
            }
          }
        }
        .swiperBox{
          border-radius: 12px;
          &:hover{
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
      }
      
    }
    .infoRight {
      width: 293px;
      height: 100%;
      box-sizing: border-box;
      border-radius: var(--radiusSize);
      .workTimeBox{
        background: #fff;
        border-radius: var(--radiusSize);
        width:100%;
        min-height:80px;
        .workTitle{
          background: linear-gradient(90deg,#f5fcfc 0,#fcfbfa 100%);
          border-radius: 12px 12px 0 0;
          font-size: 16px;
          font-weight: 500;
          color: #222;
          line-height: 22px;
          padding: 12px 24px ;
        }
        .workBox{
          padding: 10px 22px 20px;
          box-sizing: border-box;
          p{
            margin: 0;
          }
          .time,.xx{
            margin-bottom: 8px;
            padding-left: 24px;
            position:relative;
            box-sizing: border-box;
            &:before{
            content: ' ';
              position: absolute;
              top: 4px;
              left: 0;
              width: 16px;
              height: 16px;
              z-index: 1;
              background: url('../../../../assets/images/icon/timer.png') 0 -16px/16px auto no-repeat;
          }
          .xx{
            &:before{
              background: url('../../../../assets/images/icon/xx.png') 0 -16px/16px auto no-repeat;
            }
          }
          }
          .welfare{
            display:flex;
            flex-wrap:wrap;

            span{
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
  }
  .otherPosition{
    margin-top:20px;
    width: 880px ;
    .positionList{
      ::v-deep(.items){
        &:hover{
          background: #F7F7F7;
        }
        background: #fff;
      }
    }
  }
}

.ant-carousel :deep(.slick-slide) {
  text-align: center;
  height: 250px;
  line-height: 160px;
  overflow: hidden;
  .swiperItem{
    display: flex !important;
    flex-wrap: wrap;
  }
  .img{
    width: 200px!important;
    height: 120px!important;
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
