<template>
  <div class="positionList" @click="navigatePosDetails(item.position_id)" v-for="item in positionData" :key="item.id" >
    <div class="items">
      <div class="left">
        <li class="posInfo">
          <span class="posName" >{{ item.position_name }}</span>
          <span class="city">[{{ item.cityName }}]</span>
        </li>
        <li class="Info">
          <span class="salary">{{ item.salary }}</span>
          <span class="others">{{ item.experiences }}</span>
          <span class="others">{{ item.degrees }}</span>
        </li>
      </div>
      <div class="right">
        <div class="logo">
          <img :src="item.avatar" alt="">
        </div>
        <a-button type="primary" class="send" @click.stop="sendPos(item.position_id,item.company_id)">立即投递</a-button>
        <div class="hrInfo">
          <p class="hrName">{{ item.name }}</p>
          <p class="hrTitle">{{ item.hr_identity }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">  
import {addSend} from "@/api"
import {ICompanyPositionsData} from "@/types/company"
import {useUserInfo} from "@/store/user"
import {message} from 'ant-design-vue'
import {useUserLoginState} from "@/hooks/useUserLoginState"
const {userId} = useUserInfo()
const props = defineProps<{positionData?:ICompanyPositionsData[]}>()

const sendPos = async(position_id:string,company_id:string)=>{
  if(!useUserLoginState()) return
  const res:any = await addSend({userId,position_id,company_id})
  if(res.code!==200) return message.error(res.msg)
  message.success("投递成功")
}

//跳转详情
const navigatePosDetails = (position_id:string)=>{
  window.open(`/home/jobDetail?position_id=${position_id}`)
}
</script>

<style lang="less" scoped>
.positionList {
  .items {
    width: 100%;
    height: 108px;
    padding: 16px;
    box-sizing: border-box;
    transition: all 0.2s linear;
    cursor: pointer;
    background: #fff;
    display:flex;
    justify-content: space-between;
    align-items: center;
    border-radius: var(--radiusSize);
    overflow: hidden;
    margin-bottom: 20px;
    &:hover{
      .left{
        .posInfo{
          color: var(--themeColor);
        }
      }
      .right{
        .send{
          opacity: 1;
        }
        .hrInfo{
          opacity: 0;
        }
      }
    }
    .left{
      .posInfo{
        transition: all 0.2s linear;
        font-size: 17px;
        font-weight: 500;
        color: #222;
       
        .posName{
          display: inline-block;
          max-width: 230px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          vertical-align: middle;
          margin-top: -5px;
        }
        .city{
          vertical-align: middle;
          margin-left: 8px;
          position:relative;
          top:-2px;
    

        }
       
      
      }
      .Info{
        margin-top:5px;
        .salary{
          font-size: 18px;
          font-family: kanzhun-Regular,kanzhun;
          color: #fe574a;
          margin-right:9px;
        }
        .others{
          background: #f7f7f7;
          border-radius: 4px;
          padding: 2px 8px;
          font-size: 13px;
          color: #666;
          line-height: 18px;
          margin-right: 8px;
          transition: all .2s linear;
        }
      }
    }
    .right{
      display: flex;
      position: relative;
      .send{
        position: absolute;
        opacity: 0;
        left:60px;
        top:6px;
        z-index: 99;
      }
      .logo{
        width: 48px;
        height: 48px;
        border-radius: 50%;
        overflow: hidden;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .hrInfo{
        opacity: 1;
        margin-right: 86px;
        margin-left: 14px;
        p{
          margin: 0;
        }
        display: flex;
        flex-direction: column;
        .hrName{
          font-size: 16px;
        font-weight: 500;
        color: #222;
        
        }
        .hrTitle{
          display: block;
        font-size: 14px;
        color: #666;
        line-height: 20px;
        height: 20px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: left;
        }
      }
    }
  }
  
}
</style>
