<template>
  <div
    class="item"
    :class="item.position_state == '2' ? 'disabledItem' : ''"
    v-for="item in sendList"
    :key="item.sendId"
  >
    <div class="top">
      <img
      v-if="item.avatar"
        :src="item.avatar"
        alt=""
      />
      <img
        v-else
        src="https://img.bosszhipin.com/boss/avatar/avatar_7.png?x-oss-process=image/resize,w_100,limit_0"
        alt=""
      />
      <span class="hrName" v-if="item.name">{{ item.name || '' }}</span>
      <span class="hr">{{item.hr_identity || '人事'}}</span>
      <a-button
        v-show="activeIdx == 0 && item.position_state !== '2'"
        type="primary"
        class="cancelSendBtn"
        @click="cancelSendBtn(item.sendId)"
        >取消投递</a-button
      >
      <div
        class="cancelSendBtn position_close"
        v-show="activeIdx !== 3 && item.position_state == '2'"
      >
        该职位已关闭
      </div>
      <div class="cancelSendBtn position_close reject" v-show="activeIdx === 2">
        不合适
      </div>
      <div class="cancelSendBtn position_close ok" v-show="activeIdx === 1">
        已约面试
      </div>
      <a-button
        v-show="activeIdx == 3"
        type="primary"
        class="cancelSendBtn"
        @click="cancelCollectBtn(item.collect_id)"
        >取消收藏</a-button
      >
    </div>

    <div class="bottom">
      <div class="deleteIcon" @click="deleteInfo(item.sendId, item.collect_id)">
        <delete-outlined />
      </div>
      <div class="left">
        <div class="leftTop">
          <span
            class="posName"
            @click="navigateDetails(item.position_id, item.position_state)"
            >{{ item.position_name }}</span
          >
          <span class="city"
            >[ {{ item.cityName }}
            {{ item.pos_region ? `· ${item.pos_region}` : "" }} ]</span
          >
        </div>
        <div class="leftBottom">
          <span class="salary">{{ item.salary }}</span>
          <span class="tag exp">{{ item.experiences }}</span>
          <span class="tag degree">{{ item.degrees }}</span>
        </div>
      </div>
      <div class="right">
        <div class="logo">
          <img :src="item.logo" alt="" />
        </div>
        <div class="companyInfo">
          <div class="companyName" @click="navigateCompany(item.company_id)">{{ item.company_name }}</div>
          <div class="tagList">
            <span class="tag">{{ item.industry }}</span>
            <span class="tag">{{
              item.financing ? item.financing : "未融资"
            }}</span>
            <span class="tag">{{ item.people_num }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ISendData } from "@/types/send";
import { cancelOrDelSend, deleteCollect } from "@/api";
import { message } from "ant-design-vue";
import { DeleteOutlined} from '@ant-design/icons-vue';
const props = defineProps<{ sendList: ISendData[]; activeIdx: number }>();
const emits = defineEmits(["refreshData"]);

//position_state


const navigateCompany  = (company_id:string)=>{
  window.open(`/home/companyDetail?company_id=${company_id}`)
}
//取消投递
const cancelSendBtn = async (sendId: string, flag?: boolean) => {
  const res: any = await cancelOrDelSend({ sendId });
  if (res.code !== 200)
    return message.error(flag ? "删除失败" : "取消投递失败");
  message.success(flag ? "删除成功" : "取消投递成功");
  emits("refreshData");
};
//取消收藏
const cancelCollectBtn = async (
  collect_id: string | undefined,
  flag?: boolean
) => {
  if (!collect_id) return;
  const res: any = await deleteCollect({ collect_id });
  if (res.code !== 200)
    return message.error(flag ? "删除失败" : "删除收藏失败");
  message.success(flag ? "删除成功" : "已从感兴趣中移除");
  emits("refreshData");
};

const navigateDetails = (position_id: string, position_state: string) => {
  if (position_state !== "1") {
    // message.error("该职位已关闭");
    return 
  }
  window.open(`/home/jobDetail?position_id=${position_id}`);
};

//删除
const deleteInfo = async (sendId: string, collect_id: string | undefined) => {
  if (props.activeIdx === 3) {
    cancelCollectBtn(collect_id, true);
  } else {
    cancelSendBtn(sendId, true);
  }
};
</script>

<style lang="less" scoped>
.item {
  width: 100%;
  height: 135px;
  background: #fff;
  margin-bottom: 20px;
  transition: all 0.21s linear;
  border-radius: var(--radiusSize);
  border-bottom: 1px solid #edf0f5;
  &:hover {
    box-shadow: 0 16px 40px 0 hsla(0, 0%, 60%, 0.3);
    .top {
      .cancelSendBtn {
        opacity: 1;
      }
    }
    .bottom{
      .deleteIcon{
        opacity: 1;
      }}
  }
  .top {
    height: 46px;
    padding: 12px 20px;
    box-sizing: border-box;
    background: linear-gradient(90deg, #f5fcfc, #fcfbfa);
    display: flex;
    border-radius: var(--radiusSize) var(--radiusSize) 0 0 ;
    align-items: center;
    width: 100%;
    position: relative;
    img {
      width: 30px;
      border-radius: 50%;
    }
    .hrName {
      margin: 0 20px;
    }
    .cancelSendBtn {
      transition: all 0.2s linear;
      opacity: 0;
      position: absolute;
      right: 20px;
    }
    .position_close {
      opacity: 1;
      font-size: 20px;
    }
    .position_close {
      opacity: 1;
      font-size: 20px;
    }
    .ok {
      color: var(--themeColor);
      font-size: 18px;
    }
    .reject {
      font-size: 18px;
      color: rgb(219, 70, 70);
    }
  }
  .bottom {
    padding: 10px 25px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    .deleteIcon {
      position: absolute;
      bottom: 10px;
      right: 20px;
      cursor: pointer;
      transition: all 0.2s linear;
      opacity: 0;
      &:hover {
        color: var(--themeColor);
      }
    }
    .left {
      .leftTop {
        font-size: 16px;
        color: #222;
        margin-top: 5px;
        .posName {
          margin-right: 8px;
          transition: all 0.2s linear;
          cursor: pointer;
          &:hover {
            color: var(--themeColor);
          }
        }
      }
      .leftBottom {
        margin-top: 6px;
        .salary {
          font-size: 16px;
          font-weight: 500;
          color: #fe574a;
        }
        .tag {
          padding: 3px 10px;
          background: #f8f8f8;
          color: #333;
          margin-left: 10px;
          font-size: 13px;
        }
      }
    }
    .right {
      width: 400px;
      display: flex;
      justify-content: flex-start;
      .logo {
        width: 55px;
        height: 55px;
        border-radius: 50%;
        margin-right: 10px;
        margin-top: 6px;
        img {
          width: 100%;
          border-radius: 50%;
        }
      }
      .companyInfo {
        .companyName {
          font-size: 16px;
          color: #222;
          margin-top: 5px;
          transition: all 0.2s linear;
          cursor: pointer;
          overflow: hidden;
          width: 300px;
          white-space: nowrap;
          text-overflow: ellipsis;
          &:hover {
            color: var(--themeColor);
          }
        }
      }
      .tagList {
        margin-top: 7px;
        .tag {
          padding: 3px 10px;
          background: #f8f8f8;
          color: #333;
          margin-right: 12px;
          font-size: 13px;
        }
      }
    }
  }
}
.disabledItem {
  // filter: grayscale(1);
  opacity: 0.4;
  user-select: none !important;

  &:hover {
    box-shadow: none;
  }
  .posName,
  .companyName {
    cursor: default !important;
    &:hover {
      color: none !important;
    }
  }
}
</style>
