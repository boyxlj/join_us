<template>
  <div class="search" :style="{height:height?`${height}px`:'120px'}">
    <div class="container">
      <div class="box" :style="{margin:center?'0 auto':'0'}  ">
        <div class="options">
          <div
            @click.stop="clickJobType"
            :class="jobTypeFocusBox ? 'activeJob jobs' : 'jobs'"
          >
            <span class="name">职位类型</span>
            <span class="arrow"></span>
          </div>
          <input
            @focus="inputFocus"
            @blur="inputNoFocus"
            @keyup.enter="searchSubmit"
            type="text"
            name=""
            id="input"
            v-model.trim="inpVal"
            placeholder="搜索职位、公司"
          />
        </div>
        <div @mouseleave="leaveJobLi">
          <div
            class="jobTypeBox"
            @mouseenter="enterJobTypeFocusBox"
            @mouseleave="leaveJobTypeFocusBox"
            v-show="jobTypeFocusBox"
          >
            <div class="left">
              <div class="con">
                <li
                  @mouseenter="enterJobLi(item.id)"
                  v-for="item in data"
                  :key="item.id"
                  :class="activeKey === item.id ? 'actives' : ''"
                >
                  <span class="title">{{ item.name }}</span
                  ><span class="arrow"></span>
                </li>
              </div>
            </div>
            <div class="right" v-show="showJobTypeContent">
              <template v-for="item in showBoxData" :key="item.id">
                <p>{{ item.name }}</p>
                <div class="tags">
                  <span v-for="item1 in item.children" :key="item1.id">{{
                    item1.name
                  }}</span>
                </div>
              </template>
            </div>
          </div>
        </div>
        <div
          @mouseenter="enterSearchFocusBox"
          @mouseleave="leaveSearchFocusBox"
          v-show="showSearchFocusBox"
          class="searchFocusBox"
        >
          <p class="title">
            <span>历史搜索</span>
            <span
              v-if="historyData.length"
              class="clearHistory"
              @click="clearHistorySearchList"
              >清空历史</span
            >
          </p>
          <div class="historyContent">
            <span v-for="(item, index) in historyData" :key="index">{{
              item
            }}</span>
            <b v-if="!historyData.length">暂无搜索记录</b>
          </div>
          <p class="title">搜索发现</p>
          <div class="historyContent">
            <span v-for="item in 13" :key="item">Java前端</span>
            <span>Java前端</span>
          </div>
        </div>

        <div class="searchBtn" @click="searchSubmit">搜索</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { createVNode } from "vue";
import { getJobType } from "@/api";
import { IJobType } from "@/types/jobType";
import { Modal } from "ant-design-vue";
const inpVal = ref("");



withDefaults(defineProps<{center?:boolean,height?:number}>(),{
  center:true,
  height:120,
})
//输入框
const showSearchFocusBox = ref(false);
const enterSearchFocusBoxValue = ref(false);
const handleChange = () => {};
const inputFocus = () => {
  showSearchFocusBox.value = true;
};
const inputNoFocus = () => {
  if (!enterSearchFocusBoxValue.value) {
    showSearchFocusBox.value = false;
  }
};
const enterSearchFocusBox = () => {
  enterSearchFocusBoxValue.value = true;
};
const leaveSearchFocusBox = () => {
  enterSearchFocusBoxValue.value = false;
};

//职位类型
const jobTypeFocusBox = ref(false);
const enterJobTypeFocusBoxValue = ref(false);
const showJobTypeContent = ref(false);
const clickJobType = () => {
  jobTypeFocusBox.value = true;
};
const enterJobTypeFocusBox = () => {
  enterJobTypeFocusBoxValue.value = true;
};
const leaveJobTypeFocusBox = () => {
  enterJobTypeFocusBoxValue.value = false;
};
document.body.addEventListener("click", () => {
  if (!enterJobTypeFocusBoxValue.value) {
    jobTypeFocusBox.value = false;
  }
});

const data = ref<IJobType[]>([]);
const showBoxData = ref<IJobType[]>([]);
const activeKey = ref();
//获取职位类型
const getJobs = async () => {
  const res = await getJobType();
  data.value = res.data;
};
//悬停职位类型li
const enterJobLi = (id: any) => {
  showJobTypeContent.value = true;
  activeKey.value = id;
  showBoxData.value = data.value?.filter((item) => item.id == id);
};

const leaveJobLi = () => {
  showJobTypeContent.value = false;
  activeKey.value = "";
};

onMounted(() => {
  getHistorySearchList();
  getJobs();
});

//获取搜索历史
const historyData = ref<string[]>([]);
const getHistorySearchList = () => {
  const str = localStorage.getItem("searchList");
  if (!str) {
    historyData.value = [];
  } else {
    const data = JSON.parse(localStorage.getItem("searchList") as string);
    historyData.value = data;
  }
};

//存储搜索历史记录
const setHistorySearchList = (key: string) => {
  const newList = [key, ...historyData.value];
  localStorage.setItem("searchList", JSON.stringify(newList));
  getHistorySearchList();
};

//清空搜索历史记录
const clearHistorySearchList = () => {
  Modal.confirm({
    title: "温馨提示",
    icon: createVNode(ExclamationCircleOutlined),
    content: createVNode(
      "div",
      { style: "color:red;" },
      "您确定要清空所有搜索历史记录吗?"
    ),
    cancelText: "取消",
    // centered:true,
    okText: "确定",
    onOk() {
      localStorage.removeItem("searchList");
      getHistorySearchList();
    },
    onCancel() {},
    class: "test",
  });
};

//提交搜索
const searchSubmit = () => {
  if (!inpVal.value) return;
  setHistorySearchList(inpVal.value);
};
</script>

<style lang="less" scoped>
.search {
  width: 100%;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  .container {
    width: 1200px;
    margin: 0 auto;
    .box {
      width: 75%;
      height: 50px;
      // margin: 0 auto;
      border: 2.5px solid var(--themeColor);
      border-radius: var(--radiusSize);
      display: flex;
      justify-content: space-between;
      justify-content: flex-start !important;
      position: relative;
      .searchFocusBox {
        position: absolute;
        width: 650px;
        min-height: 230px;
        background: #fff;
        top: 55px;
        left: 140px;
        z-index: 99;
        border-radius: var(--radiusSize);
        box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.08);
        padding: 15px 18px;
        box-sizing: border-box;
        .title {
          widows: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: #757575;
          line-height: 17px;

          .clearHistory {
            cursor: pointer;
            transition: all 0.2s;
            &:hover {
              color: var(--themeColor);
            }
          }
        }
        .historyContent {
          width: 100%;
          font-size: 14px;
          color: #666;
          margin-bottom: 20px;
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          span {
            padding: 2px 8px;
            background: #f8f8f8;
            border-radius: 6px;
            margin-right: 13px;
            margin-bottom: 10px;
            cursor: pointer;
            transition: all 0.2s;
            &:hover {
              color: #fff;
              background: var(--themeColor);
            }
          }
        }
      }
      .options {
        display: flex;
        width: 88%;
        position: absolute;
        left: 0;
        height: 100%;
        border-radius: var(--radiusSize);
        justify-content: space-between;
        z-index: 7;
        overflow: hidden;
        background: #fff;

        .jobs {
          width: 130px;
          height: 50px;
          line-height: 50px;
          padding: 0 20px;
          cursor: pointer;
          text-align: center;
          &:hover {
            .name {
              color: var(--themeColor);
            }
            .arrow {
              border-top: 5px solid var(--themeColor);
            }
          }
          .name {
            transition: all 0.2s;
            color: #222;
            font-size: 16px;
          }
          .arrow {
            transition: all 0.2s;
            display: inline-block;
            border: 5px solid transparent;
            border-top: 5px solid #cbcbcb;
            margin-left: 10px;
          }
        }
        .activeJob {
          .name {
            color: var(--themeColor);
          }
          .arrow {
            border-top: 5px solid var(--themeColor);
          }
        }

        #input {
          width: 100%;
          flex: 1;
          border: none;
          background: #fff;
          outline: none;
          padding-left: 25px;
          height: 100%;
          border-radius: var(--radiusSize);
          font-size: 16px;
          &::-webkit-input-placeholder {
            font-size: 16px;
          }
        }
      }
      .jobTypeBox {
        width: 88%;
        height: 188px;
        position: absolute;
        top: 52px;
        left: 0;
        z-index: 100;
        display: flex;
        overflow: hidden;
        justify-content: space-between;
        border-radius: var(--radiusSize);
        .left {
          width: 22%;
          height: 100%;
          padding-top: 8px;
          box-sizing: border-box;
          background: #fff;
          // box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08);
          border: 2px solid #eee;
          border-radius: var(--radiusSize) !important;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-content: center;
          .con {
            padding-bottom: 5px !important;
            box-sizing: border-box;
            height: 100%;
            width: 100%;
            overflow-y: auto;
            li {
              width: 100%;
              padding: 0 10px 0 15px;
              box-sizing: border-box;
              display: flex;
              justify-content: space-between;
              align-items: center;
              height: 35px;
              cursor: pointer;
              &:hover {
                color: var(--themeColor);
                background: #f8f8f8;
                .name {
                  color: var(--themeColor);
                }
                .arrow {
                  border-left: 5px solid var(--themeColor);
                }
              }

              .arrow {
                transition: all 0.2s;
                display: inline-block;
                border: 5px solid transparent;
                border-left: 5px solid #cbcbcb;
                margin-left: 10px;
              }
            }
            .actives {
              background: #f8f8f8;
              color: var(--themeColor);
              .name {
                color: var(--themeColor);
              }
              .arrow {
                border-left: 5px solid var(--themeColor);
              }
            }
          }
        }
        .right {
          width: 77.5%;
          border-radius: var(--radiusSize);
          height: 100%;
          background: rgb(197, 123, 123);
          background: #fff;
          // box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.08);
          padding: 10px 15px 0 20px;
          box-sizing: border-box;
          border: 2px solid #eee;
          p {
            margin-bottom: 4px;
            font-size: 16px;
          }
          .tags {
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;
            span {
              margin-right: 30px;
              line-height: 32px;
              cursor: pointer;
              transition: all 0.2s;
              &:hover {
                color: var(--themeColor);
              }
            }
          }
        }
      }

      .searchBtn {
        width: 115px;
        position: absolute;
        right: 0;
        height: 100%;
        background: var(--themeColor);
        color: #fff;
        font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 18px;

        &:hover {
          background: #7b3ebd;
        }
      }
    }
  }
}
</style>
