<template>
  <div class="profile">
    <div class="container">
      <div class="menus">
        <div class="title">简历目录</div>
        <li
          @click="clickMenuItem(index, item.href)"
          :class="activeMenu === index ? 'activeMenu' : ''"
          v-for="(item, index) in menuList"
          :key="item.id"
        >
          {{ item.name }}
        </li>
      </div>
      <div class="contents">
        <div class="onLineResume"><span>我的在线简历</span></div>
        <Info
          :userInfo="userInfo"
          v-if="states.info"
          :changeInfoForm="changeInfoForm"
        />
        <div v-else id="showInfo" class="showInfo" @click="changeInfoForm">
          <div class="name">
            <span>{{ userInfo.name }}</span>
          </div>
          <div class="degree">
            <li>
              <img src="../../assets/images/icon/degree.png" alt="" /><span
                >{{ userInfo.leave_schoolTime?.split("-")[0] }}年应届生</span
              >
            </li>
            <li>
              <img src="../../assets/images/icon/degree1.png" alt="" /><span>{{
                userInfo.degree
              }}</span>
            </li>
            <li>
              <img src="../../assets/images/icon/hope_job.png" alt="" /><span>{{
                userInfo.apply_state
              }}</span>
            </li>
          </div>
          <div class="connect">
            <li>
              <img src="../../assets/images/icon/tel.png" alt="" /><span>{{
                userInfo.phone
              }}</span>
            </li>
            <li>
              <img src="../../assets/images/icon/email.png" alt="" /><span>{{
                userInfo.email
              }}</span>
            </li>
          </div>
          <a-tooltip placement="top">
            <template #title>
              <span>点击可上传头像</span>
            </template>
            <div class="avatar" @click.stop="clickAvatar">
              <img :src="userInfo.avatar" alt="" />
            </div>
          </a-tooltip>
          <div class="editor">
            <p><edit-outlined class="icon" /><span>编辑</span></p>
          </div>
        </div>
        <Advantage
          :userInfo="userInfo"
          v-if="states.advantage"
          :changeAdvantageForm="changeAdvantageForm"
        ></Advantage>
        <div
          v-else
          id="showAdvantage"
          class="showAdvantage"
          @click="changeAdvantageForm"
        >
          <div class="title"><span>个人优势</span></div>
          <div class="advantageContent">
            <div class="empty" v-show="false">数据为空</div>
            <div class="editor">
              <p><edit-outlined class="icon" /><span>编辑</span></p>
            </div>
            <pre>{{ userInfo.advantage }}</pre>
          </div>
        </div>
        <HopeJob
          :userInfo="userInfo"
          v-if="states.hope_job"
          :changeHopeJobForm="changeHopeJobForm"
        ></HopeJob>
        <div
          v-else
          id="showHopeJob"
          class="showHopeJob"
          @click="changeHopeJobForm"
        >
          <div class="title"><span>期望职位</span></div>
          <div class="hopeJobContent">
            <div class="empty" v-show="false">数据为空</div>
            <div class="editor">
              <p><edit-outlined class="icon" /><span>编辑</span></p>
            </div>
            <li>
              <sliders-outlined /><span>{{ userInfo.hope_job }}</span>
            </li>
            <li>
              <transaction-outlined /><span>{{ userInfo.hope_salary }}</span>
            </li>
            <li>
              <fund-outlined /><span>{{ userInfo.hope_industry }}</span>
            </li>
            <li>
              <aim-outlined /><span>{{ userInfo.hope_city }}</span>
            </li>
          </div>
        </div>
        <WorkExp
          :userInfo="userInfo"
          :resumeId="resumeId"
          v-if="states.work_exp"
          :changeWorkExpForm="changeWorkExpForm"
        ></WorkExp>
        <div v-else id="showWorkExp" class="showWorkExp">
          <div class="title">
            <span class="tips">工作经历</span
            ><span @click="changeWorkExpForm()" class="add"
              ><plus-square-outlined class="icons" />添加</span
            >
          </div>
          <div class="empty" v-show="false">数据为空</div>
          <div
            class="workExpContent"
            @click="changeWorkExpForm(item.resume_id)"
            v-for="item in resumeList"
            :key="item.id"
          >
            <div class="editor">
              <p><edit-outlined class="icon" /><span>编辑</span></p>
            </div>
            <li class="name">
              <span class="weight">{{ item.company }}</span
              ><span class="time"
                >{{ item.enter_time }}-{{ item.leave_time }}</span
              >
            </li>
            <li class="role">
              <span class="buMen" v-if="item.department">{{
                item.department
              }}</span
              ><span>{{ item.post }}</span>
            </li>
            <li class="desc">
              <span class="descTitle">工作内容: </span><br />
              <pre style="white-space: pre-wrap">{{ item.content }}</pre>
            </li>
            <li class="desc" v-if="item.performance">
              <span class="descTitle">工作业绩: </span><br />
              <pre style="white-space: pre-wrap">{{ item.performance }}</pre>
            </li>
            <li class="skill" v-if="item.skill.length">
              <span
                v-for="(tag, index) in JSON.parse(item.skill)"
                :key="index"
                >{{ tag }}</span
              >
            </li>
          </div>
        </div>
        <EducationExp
          :userInfo="userInfo"
          :resumeId="resumeId"
          v-if="states.education_exp"
          :changeEducationExpForm="changeEducationExpForm"
        ></EducationExp>
        <div v-else id="showEducationExp" class="showEducationExp">
          <div class="title"><span class="tips">教育经历</span></div>
          <div class="empty" v-show="false">数据为空</div>
          <div class="workExpContent" @click="changeEducationExpForm">
            <div class="editor">
              <p><edit-outlined class="icon" /><span>编辑</span></p>
            </div>
            <li class="name">
              <span class="weight">{{ userInfo.school }}</span
              ><span class="time">
                {{ userInfo.enter_schoolTime }}-{{ userInfo.leave_schoolTime }}
              </span>
            </li>
            <li class="role">
              <span class="buMen">{{ userInfo.major }}</span
              ><span>{{ userInfo.degree }}</span>
            </li>
            <li class="desc">
              <span class="descTitle">在校经历: </span><br />
              <pre style="white-space: pre-wrap">{{ userInfo.school_exp }}</pre>
            </li>
          </div>
        </div>
      </div>
      <div class="asides">
        <UserInfoBox :show="false"/>
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
          <PositionCard></PositionCard>
        <PositionCard origin="sort" title="最新职位"></PositionCard>
      </div>
    </div>
    <div class="navbar">
    <Navbar />
  </div>

  <!-- 编辑用户头像对话框 -->
  <a-modal
    cancelText="取消"
    centered
    :maskClosable="false"
    okText="确认"
    v-model:visible="avatarModelVisible"
    title="修改用户头像"
    @ok="handleAvatarModelOk"
    @cancel="cancelAvatarModelOk"
  >
    <a-upload
      v-model:file-list="fileList"
      name="avatar"
      list-type="picture-card"
      class="avatar-uploader"
      :show-upload-list="false"
      :action="uploadUserAvatarUrl"
      :before-upload="beforeUpload"
      @change="handleChange"
    >
      <img style="width: 100%" v-if="imageUrl" :src="imageUrl" alt="avatar" />
      <div v-else>
        <loading-outlined v-if="loading"></loading-outlined>
        <plus-outlined v-else></plus-outlined>
        <div class="ant-upload-text">上传图像</div>
      </div>
    </a-upload>
    <div>* 图像大小不能超过2MB,且类型必须为jpg、jpeg、png</div>
  </a-modal>
  </div>


</template>

<script setup lang="ts">
import {
  PlusOutlined,
  LoadingOutlined,
  DeleteOutlined,
  SlidersOutlined,
  PlusSquareOutlined,
  AimOutlined,
  EditOutlined,
  FundOutlined,
  TransactionOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import type { UploadChangeParam } from "ant-design-vue";
import PositionCard from "@/components/common/positionCard/index.vue";
import UserInfoBox from "@/components/common/userInfoBox/index.vue";
import Navbar from "@/components/common/navbar/index.vue";
import Info from "./components/info/index.vue";
import Advantage from "./components/advantage/index.vue";
import HopeJob from "./components/hopeJob/index.vue";
import WorkExp from "./components/workExp/index.vue";
import EducationExp from "./components/educationExp/index.vue";
import { IUserInfo } from "@/types/userInfo";
import { useUserInfo } from "@/store/user";
import { getAge } from "@/utils/getAge";
import { uploadUserAvatarUrl } from "@/api/upload";
const userStore = useUserInfo();
const userInfo: IUserInfo = computed(
  () => userStore.userInfoList[0]
) as unknown as IUserInfo;
const resumeList: IResumeData[] = computed(
  () => userStore.resumeList
) as unknown as IResumeData[];
const activeMenu = ref(0);

interface IResumeData {
  id: number;
  resume_id: string;
  userId: string;
  company: string;
  industry: string;
  post: string;
  department: string;
  enter_time: string;
  leave_time: string;
  content: string;
  performance: string;
  skill: string;
  addTime?: any;
  update_time?: any;
}
const menuList = ref([
  { id: 1, name: "个人信息", href: "showInfo" },
  { id: 2, name: "个人优势", href: "showAdvantage" },
  { id: 3, name: "期望职位", href: "showHopeJob" },
  { id: 4, name: "工作经历", href: "showWorkExp" },
  { id: 6, name: "教育经历", href: "showEducationExp" },
]);

const clickMenuItem = (id: number, href: string) => {
  activeMenu.value = id;
  document.getElementById(href)?.scrollIntoView({ behavior: "smooth" });
};

//编辑id
const resumeId = ref("");
//点击添加简历按钮

const states = reactive({
  info: false, // 不显示表单
  advantage: false,
  hope_job: false,
  work_exp: false,
  project_exp: false,
  education_exp: false,
});

//切换基本信息 info
const changeInfoForm = () => {
  states.info ? (states.info = false) : (states.info = true);
};
//切换个人优势 advantage
const changeAdvantageForm = () => {
  states.advantage ? (states.advantage = false) : (states.advantage = true);
};
//切换期望职位 hope_job
const changeHopeJobForm = () => {
  states.hope_job ? (states.hope_job = false) : (states.hope_job = true);
};
//切换教育经历 education_exp
const changeEducationExpForm = () => {
  states.education_exp
    ? (states.education_exp = false)
    : (states.education_exp = true);
};
//切换工作经历 work_exp
const changeWorkExpForm = (id?: string) => {
  if (!id) {
    resumeId.value = "";
  } else {
    resumeId.value = id;
  }
  states.work_exp ? (states.work_exp = false) : (states.work_exp = true);
};

//点击用户头像
const fileList = ref([]);
const loading = ref<boolean>(false);
const imageUrl = ref<string>("");
const avatarModelVisible = ref(false);
const clickAvatar = () => {
  avatarModelVisible.value = true;
  imageUrl.value = userInfo.value.avatar;
};
const handleAvatarModelOk = async () => {
  if (userInfo.value.avatar === imageUrl.value) {
    return (avatarModelVisible.value = false);
  }
  if (!imageUrl.value) return message.warning("请先上传图片");
  const res: any = await userStore.updateUseInfo({ avatar: imageUrl.value });
  if (res !== 200) return message.error("修改失败");
  avatarModelVisible.value = false;
};
const cancelAvatarModelOk = () => {
  imageUrl.value = "";
  avatarModelVisible.value = false;
};
const handleChange = (info: UploadChangeParam) => {
  if (info.file.status === "uploading") {
    loading.value = true;
    return;
  }

  if (info.file.status === "error") {
    loading.value = false;
    message.error("图片上传失败");
  }
  if (info.file.status === "done") {
    loading.value = false;
    if (info.file.response.code !== 200) return message.error("图片上传失败");
    imageUrl.value = info.file.response.url;
  }
};
const beforeUpload = (file: any) => {
  const allowImgType = ["jpeg", "png", "jpg"];
  if (!allowImgType.includes(file.type?.split("/")[1])) {
    message.error(`图片只能上传以下类型：${allowImgType.join("、")}`);
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("图片的大小不能超过 2MB!");
  }
  return allowImgType.includes(file.type?.split("/")[1]) && isLt2M;
};
</script>

<style lang="less" scoped>
.profile {
  width: 100%;
  .container {
    width: 1200px;
    min-height: 1000px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    .menus {
      width: 160px;
      height: 270px;
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
        transition: all 0.2s linear;
        &:hover {
          background: #fff;
          box-shadow: 0 2px 14px 0 rgba(0, 0, 0, 0.05);
        }
        .name {
          color: #24272e;
          height: 33px;
          line-height: 33px;
          font-size: 24px;
          margin-bottom: 8px;
          margin-bottom: 15px;
        }
        .degree,
        .connect {
          display: flex;
          width: 100%;
          align-items: center;
          li {
            position: relative;
            margin-right: 30px;
            margin-top: 4px;
            padding: 0 5px;
            &::after {
              width: 1px;
              content: "";
              height: 10px;
              background: #d4d5d6;
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              right: -14px;
            }
            &:last-child {
              &::after {
                display: none;
              }
            }
            img {
              width: 12px;
              margin-right: 5px;
              position: relative;
              top: -1px;
            }
            span {
              font-size: 14px;
            }
          }
        }
        .avatar {
          position: absolute;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          overflow: hidden;
          right: 22px;
          top: 15px;
          img {
            width: 100%;
          }
        }
        &:hover {
          .editor {
            span,
            .icon {
              opacity: 1;
              color: var(--themeColor);
            }
          }
        }
        .editor {
          position: absolute;
          font-size: 14px;
          right: 35px;
          bottom: 18px;
          p {
            margin: 0;
          }
          span,
          .icon {
            opacity: 0;
            transition: all 0.2s linear;
          }
          .icon {
            margin-right: 6px;
          }
        }
      }
      .showAdvantage {
        width: 100%;
        min-height: 80px;
        padding: 15px 25px 25px;
        box-sizing: border-box;
        cursor: pointer;
        transition: all 0.2s linear;
        &:hover {
          background: #f8f8f8;
          .advantageContent {
            background: #fff;
            .editor {
              opacity: 1;
              color: var(--themeColor);
            }
          }
        }
        & > .title {
          height: 25px;
          font-size: 18px;
          height: 25px;
          line-height: 25px;
          font-weight: 400;
          position: relative;
          &::before {
            position: absolute;
            content: "";
            left: 0;
            top: 50%;
            width: 3px;
            height: 75%;
            transform: translateY(-50%);
            background: var(--themeColor);
          }
          span {
            margin-left: 10px;
          }
        }
        .advantageContent {
          width: 100%;
          min-height: 60px;
          transition: all 0.2s linear;
          padding: 10px 40px 10px 4px;
          box-sizing: border-box;
          position: relative;
          margin-top: 4px;
          .editor {
            opacity: 0;
            transition: all 0.2s linear;
            position: absolute;
            top: 8px;
            right: 20px;
            cursor: pointer;
          }
        }
      }
      .showHopeJob {
        width: 100%;
        min-height: 100px;
        padding: 15px 25px 25px;
        box-sizing: border-box;
        cursor: pointer;
        transition: all 0.2s linear;
        &:hover {
          background: #f8f8f8;
          .hopeJobContent {
            background: #fff;
            .editor {
              opacity: 1;
              color: var(--themeColor);
            }
          }
        }
        & > .title {
          height: 25px;
          font-size: 18px;
          height: 25px;
          line-height: 25px;
          font-weight: 400;
          position: relative;
          &::before {
            position: absolute;
            content: "";
            left: 0;
            top: 50%;
            width: 3px;
            height: 75%;
            transform: translateY(-50%);
            background: var(--themeColor);
          }
          span {
            margin-left: 10px;
          }
        }
        .hopeJobContent {
          width: 100%;
          min-height: 50px;
          transition: all 0.2s linear;
          padding: 10px 40px 10px 4px;
          box-sizing: border-box;
          position: relative;
          margin-top: 4px;
          display: flex;
          li {
            margin-right: 30px;
            span {
              margin-left: 8px;
              color: #b0b0b0;
              &:last-child {
                color: #000;
              }
            }
          }
          .editor {
            opacity: 0;
            transition: all 0.2s linear;
            position: absolute;
            top: 8px;
            right: 20px;
            cursor: pointer;
          }
        }
      }
      .showWorkExp {
        width: 100%;
        min-height: 100px;
        padding: 15px 25px 25px;
        box-sizing: border-box;
        cursor: pointer;
        transition: all 0.2s linear;
        &:hover {
          background: #f8f8f8;

          .title {
            .add {
              opacity: 1;
              color: var(--themeColor);
              .icons {
                color: var(--themeColor);
              }
            }
          }
        }
        & > .title {
          height: 25px;
          font-size: 18px;
          height: 25px;
          line-height: 25px;
          font-weight: 400;
          position: relative;
          display: flex;
          justify-content: space-between;
          align-items: center;
          &::before {
            position: absolute;
            content: "";
            left: 0;
            top: 50%;
            width: 3px;
            height: 75%;
            transform: translateY(-50%);
            background: var(--themeColor);
          }
          span {
            margin-left: 10px;
          }
          .add {
            opacity: 0;
            transition: all 0.2s linear;
            font-size: 14px;
            position: relative;
            top: -2px;
            .icons {
              margin-right: 6px;
            }
          }
        }
        .workExpContent {
          width: 100%;
          min-height: 150px;
          transition: all 0.2s linear;
          padding: 15px 40px 15px 15px;
          box-sizing: border-box;
          position: relative;
          margin-top: 4px;
          margin-bottom: 10px;
          transition: all 0.2s linear;
          &:hover {
            background: #fff;
            .editor {
              opacity: 1;
              color: var(--themeColor);
            }
          }
          li {
            width: 100%;
            line-height: 25px;
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;
            margin-bottom: 6px;
          }
          .name {
            .weight {
              color: #394051;
              font-weight: 700;
              font-size: 15px;
              margin-right: 30px;
            }
            .time {
              color: #9fa3b0;
              font-size: 12px;
            }
          }
          .role {
            font-size: 15px;
            span {
              color: #394051;
              font-weight: 700;
            }
            .buMen {
              margin-right: 30px;
              position: relative;
              &::after {
                content: "";
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 2px;
                right: -15px;
                height: 60%;
                background: #cecdcd;
              }
            }
          }
          .skill {
            width: 100%;
            display: flex;
            flex-wrap: nowrap;
            span {
              border-radius: 50px;
              border: 1px solid #cfd1d7;
              color: #9fa3b0;
              padding: 0px 18px;
              margin-right: 15px;
              margin-bottom: 8px;
            }
          }
          .desc,
          .links {
            display: inline-block;
            span {
              font-size: 15px;
              color: #61687c;
              &:first-child {
                margin-right: 6px;
              }
            }
            .descTitle,
            .linkTitle {
              font-weight: 700;
            }
          }
          .editor {
            opacity: 0;
            transition: all 0.2s linear;
            position: absolute;
            top: 8px;
            right: 20px;
            cursor: pointer;
          }
        }
      }
      .showEducationExp {
        width: 100%;
        min-height: 100px;
        padding: 15px 25px 25px;
        box-sizing: border-box;
        cursor: pointer;
        transition: all 0.2s linear;
        &:hover {
          background: #f8f8f8;

          .title {
            .add {
              opacity: 1;
              color: var(--themeColor);
              .icons {
                color: var(--themeColor);
              }
            }
          }
        }
        & > .title {
          height: 25px;
          font-size: 18px;
          height: 25px;
          line-height: 25px;
          font-weight: 400;
          position: relative;
          display: flex;
          justify-content: space-between;
          align-items: center;
          &::before {
            position: absolute;
            content: "";
            left: 0;
            top: 50%;
            width: 3px;
            height: 75%;
            transform: translateY(-50%);
            background: var(--themeColor);
          }
          span {
            margin-left: 10px;
          }
          .add {
            opacity: 0;
            transition: all 0.2s linear;
            font-size: 14px;
            position: relative;
            top: -2px;
            .icons {
              margin-right: 6px;
            }
          }
        }
        .workExpContent {
          width: 100%;
          min-height: 80px;
          transition: all 0.2s linear;
          padding: 15px 40px 15px 15px;
          box-sizing: border-box;
          position: relative;
          margin-top: 4px;
          margin-bottom: 10px;
          transition: all 0.2s linear;
          &:hover {
            background: #fff;
            .editor {
              opacity: 1;
              color: var(--themeColor);
            }
          }
          li {
            width: 100%;
            line-height: 25px;
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;
            margin-bottom: 6px;
          }
          .name {
            .weight {
              color: #394051;
              font-weight: 700;
              font-size: 15px;
              margin-right: 30px;
            }
            .time {
              color: #9fa3b0;
              font-size: 12px;
            }
          }
          .role {
            font-size: 15px;
            span {
              color: #394051;
              font-weight: 700;
            }
            .buMen {
              margin-right: 30px;
              position: relative;
              &::after {
                content: "";
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 2px;
                right: -15px;
                height: 60%;
                background: #cecdcd;
              }
            }
          }

          .desc,
          .links {
            display: inline-block;
            span {
              font-size: 15px;
              color: #61687c;
              &:first-child {
                margin-right: 6px;
              }
            }
            .descTitle,
            .linkTitle {
              font-weight: 700;
            }
          }
          .editor {
            opacity: 0;
            transition: all 0.2s linear;
            position: absolute;
            top: 8px;
            right: 20px;
            cursor: pointer;
          }
        }
      }
    }
    .asides {
      width: 260px;
      height: 100%;
      border-radius: var(--radiusSize);
   
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
  z-index: 999;
}
</style>
