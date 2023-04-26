<template>
  <div class="profile">
    <div class="container">
      <div class="menus">
        <div class="title">简历目录</div>
        <li
          @click="clickMenuItem(index)"
          :class="activeMenu === index ? 'activeMenu' : ''"
          v-for="(item, index) in menuList"
          :key="item.id"
        >
          {{ item.name }}
        </li>
      </div>
      <div class="contents">
        <div class="onLineResume"><span>我的在线简历</span></div>
        <Info v-if="states.info" :changeInfoForm="changeInfoForm" />
        <div v-else class="showInfo" @click="changeInfoForm">
          <div class="name"><span>二狗子</span></div>
          <div class="degree">
            <li><img src="../../assets/images/icon/degree.png" alt=""><span>23年应届生</span></li>
            <li><img src="../../assets/images/icon/degree1.png" alt=""><span>大专</span></li>
            <li><img src="../../assets/images/icon/hope_job.png" alt=""><span>离职</span></li>
          </div>
          <div class="connect">
            <li><img src="../../assets/images/icon/tel.png" alt=""><span>188127666666</span></li>
            <li><img src="../../assets/images/icon/email.png" alt=""><span>x709500@163.com</span></li>
          </div>
          <div class="avatar">
            <img src="https://img.bosszhipin.com/boss/avatar/avatar_15.png" alt="" />
          </div>
          <div class="editor"><p ><edit-outlined class="icon" /><span>编辑</span></p></div>
        </div>
      </div>
      <div class="asides">
        <div class="userCard">
          <div class="info">
            <div class="left">
              <img
                src="https://img.bosszhipin.com/boss/avatar/avatar_15.png"
                alt=""
              />
            </div>
            <div class="right">
              <div class="top">二狗子</div>
              <div class="bottom">
                <span>22岁</span>
                <!-- <span>23年应届生</span> -->
                <span>博士</span>
              </div>
            </div>
          </div>
          <div class="btns">编辑</div>
          <div class="sendInfo">
            <li><span class="weight">842</span><span>已投递</span></li>
            <li><span class="weight">45</span><span>不合适</span></li>
            <li><span class="weight">0</span><span>面试</span></li>
            <li><span class="weight">329</span><span>感兴趣</span></li>
          </div>
        </div>
        <div class="resume">
          <div class="title">附件简历</div>
          <div class="resumeContent">
            <div class="list">
              <li>
                <span>个人简历-pdf</span
                ><span class="del"><delete-outlined /></span>
              </li>
            </div>
            <div class="btns">上传附件简历</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="navbar">
    <Navbar />
  </div>
</template>

<script setup lang="ts">
import { DeleteOutlined ,EditOutlined} from "@ant-design/icons-vue";
import Navbar from "@/components/common/navbar/index.vue";
import Info from "./components/info/index.vue";
const activeMenu = ref(0);
const menuList = ref([
  { id: 1, name: "个人信息" },
  { id: 2, name: "个人优势" },
  { id: 3, name: "期望职位" },
  { id: 4, name: "工作经历" },
  { id: 5, name: "项目经历" },
  { id: 6, name: "教育经历" },
  { id: 7, name: "自定义添加" },
]);

const states = reactive({
  info: false, // 不显示表单
  advantage: false,
  hope_job: false,
  work_exp: false,
  project_exp: false,
  project_exp: false,
  education_exp: false,
});

//切换
const changeInfoForm = () => {
  states.info?states.info = false:states.info = true;
};

const clickMenuItem = (id: number) => {
  activeMenu.value = id;
};
</script>

<style lang="less" scoped>
.profile {
  width: 100%;
  .container {
    width: 1200px;
    height: 1000px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    .menus {
      width: 160px;
      height: 350px;
      background: #fff;
      border-radius: var(--radiusSize);
      position: sticky;
      top: 70px;
      .title {
        height: 50px;
        line-height: 50px;
        font-size: 16px;
        color: #242721;
        padding-left: 20px;
        box-sizing: border-box;
      }
      li {
        color: #61687c;
        height: 42px;
        line-height: 43px;
        padding-left: 15px;
        box-sizing: border-box;
        cursor: pointer;
        transition: all 0.2s linear;
        &:hover {
          background: #f1f1f1;
        }
      }
      .activeMenu {
        background: #f1f1f1;
      }
    }
    .contents {
      width: 720px;
      flex: 1;
      margin: 0 16px;
      background: #fff;
      border-radius: var(--radiusSize);
      .onLineResume {
        padding: 0 22px;
        box-sizing: border-box;
        width: 100%;
        height: 50px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        border-bottom: 1px solid #f3f3f3;
        span {
          font-weight: 600;
        }
      }
      .showInfo {
        padding: 15px 20px;
        box-sizing: border-box;
        position: relative;
        cursor: pointer;
        height: 134px;
        transition: all .2s linear;
        &:hover{
          background: #fff;
         box-shadow: 0 2px 14px 0 rgba(0,0,0,.05);
        }
        .name {
          color: #24272e;
          height: 33px;
          line-height: 33px;
          font-size: 24px;
          margin-bottom: 8px;
          margin-bottom: 15px;
        }
        .degree,.connect{
          display: flex;
          width: 100%;
          align-items: center;
          li{
            position: relative;
            margin-right: 30px;
            margin-top: 4px;
            padding: 0 5px;
            &::after{
              width: 1px ;
              content: '';
              height: 10px;
              background: #d4d5d6;
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              right: -14px;
            }
            &:last-child{
              &::after{
                display: none;
              }
            }
            img{
              width: 12px;
              margin-right: 5px;
              position: relative;
              top: -1px;
            }
            span{
              font-size: 14px;
            }
          }
        }
        .avatar{
          position: absolute;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          overflow: hidden;
          right: 22px;
          top: 15px;
          img{
            width: 100%;
          }
        }
        &:hover{
          .editor{
            span,.icon{
              opacity: 1;
              color: var(--themeColor);
            }
          }
        }
        .editor{
          position: absolute;
          font-size: 14px;
          right: 35px;
          bottom: 18px;
          p{
            margin: 0;
          }
          span,.icon{
            opacity: 0;
            transition: all .2s linear;
          }
          .icon{
            margin-right: 6px;
          }

        }
        
      }
    }
    .asides {
      width: 260px;
      height: 100%;
      // background: #fff;
      border-radius: var(--radiusSize);
      .userCard {
        width: 100%;
        background: #fff;
        height: 195px;
        margin-bottom: 20px;
        border-radius: var(--radiusSize);
        padding: 10px 20px;
        box-sizing: border-box;
        .info {
          width: 100%;
          height: 60px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          box-sizing: border-box;
          .left {
            width: 47px;
            height: 47px;
            border-radius: 50%;
            img {
              border-radius: 50%;
              width: 100%;
            }
          }
          .right {
            flex: 1;
            margin-left: 12px;
            .top {
              font-size: 16px;
              color: #222;
            }
            .bottom {
              font-size: 12px;
              color: #666;
              span {
                margin-right: 24px;
                position: relative;
                &::after {
                  content: "";
                  position: absolute;
                  width: 1px;
                  height: 12px;
                  top: 51%;
                  right: -12px;
                  transform: translateY(-50%);
                  background: #e0e0e0;
                }
                &:last-child {
                  &::after {
                    display: none;
                  }
                }
              }
            }
          }
        }
        .btns {
          width: 100%;
          border-radius: var(--radiusSize);
          cursor: pointer;
          height: 38px;
          margin: 10px auto;
          transition: all 0.2s linear;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1px solid #d4d5d6;
          &:hover {
            color: var(--themeColor);
            border: 1px solid var(--themeColor);
          }
        }
        .sendInfo {
          width: 100%;
          height: 50px;
          display: flex;
          background: linear-gradient(90deg, #f5fcfc, #fcfbfa);
          justify-content: space-between;
          li {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            &:hover {
              .weight {
                color: var(--themeColor);
              }
            }
            span {
              font-size: 12px;
              color: #666;
              font-weight: 400;
            }
            .weight {
              font-size: 18px;
              font-family: kanzhun;
              color: #222;
              transition: all 0.1s linear;
            }
          }
        }
      }
      .resume {
        width: 100%;
        margin-bottom: 20px;
        border-radius: var(--radiusSize);
        min-height: 100px;
        background: #fff;
        .title {
          width: 100%;
          height: 46px;
          line-height: 46px;
          padding-left: 18px;
          box-sizing: border-box;
          font-size: 16px;
          font-weight: 500;
          color: #222;
          background: linear-gradient(90deg, #f5fcfc, #fcfbfa);
        }
        .resumeContent {
          padding: 10px 0;
          box-sizing: border-box;
          min-height: 100px;
          .list {
            padding: 0 5px;
            box-sizing: border-box;
            li {
              display: flex;
              justify-content: space-between;
              align-items: center;
              height: 40px;
              padding: 0 10px;
              box-sizing: border-box;
              transition: all 0.2s linear;
              cursor: pointer;
              &:hover {
                background: #f8f8f8;
              }
              span {
                &:first-child {
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  max-width: 194px;
                  color: #333;
                  font-size: 14px;
                }
                &:last-child {
                  .del {
                    background: #cccccc;
                  }
                }
              }
            }
          }
          .btns {
            width: 90%;
            border-radius: var(--radiusSize);
            cursor: pointer;
            height: 38px;
            margin: 10px auto;
            transition: all 0.2s linear;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid #d4d5d6;
            color: #fff;
            background: var(--themeColor);
            &:hover {
              background: var(--btnHoverThemeColor);
            }
          }
        }
      }
    }
  }
}

.navbar {
  position: fixed !important;
  top: 0;
  left: 0;
  right: 0;
}
</style>
