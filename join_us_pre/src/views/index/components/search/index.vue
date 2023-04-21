<template>
  <div class="search">
    <div class="container">
      <div class="box">
        <div class="options">
          <a-select
            ref="select"
            v-model:value="selectVal"
            id="jobType"
            style="width: 120px"
            @change="handleChange"
          >
            <a-select-option value="jack">Jack</a-select-option>
            <a-select-option value="lucy">Lucy</a-select-option>
            <a-select-option value="disabled" disabled
              >Disabled</a-select-option
            >
            <a-select-option value="Yiminghe">yiminghe</a-select-option>
          </a-select>
          <input type="text" name="" id="input" placeholder="搜索职位、公司" />
        </div>
        <div class="searchBtn">搜索</div>
      </div>
      <div class="topKey">
        <span>热搜职位：</span>
        <li>Java</li>
        <li>Python</li>
        <li>Android</li>
        <li>运维工程师</li>
        <li>IT技术支持</li>
        <li>前端开发工程师</li>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const selectVal = ref("Jack");
const inpVal = ref("");
const handleChange = () => {};
</script>

<style lang="less" scoped>
.search {
  widows: 100%;
  height: 140px;
  display: flex;
  justify-content: center;
  align-items: center;

  .container {
    width: 1200px;
    margin: 0 auto;
    .box {
      width: 75%;
      height: 50px;
      margin: 0 auto;
      border: 2px solid var(--themeColor);
      border-radius: var(--radiusSize);
      display: flex;
      justify-content: space-between;
      position: relative;
      margin-top: 15px;
      .options {
        display: flex;
        width: 88%;
        position: absolute;
        left: 0;
        height: 100%;
        border-radius: var(--radiusSize);
        justify-content: space-between;
        z-index: 99;
        overflow: hidden;
        #jobType {
          width: 130px;
          border: none;
          outline: none;
          padding-left: 15px;
          background: #fff;
          .ant-select {
            height: 100%;
            border: none !important;
          }
          .ant-select:not {
            ::v-deep(.ant-select-selector) {
              border: none !important;
            }
          }
        }
        .ant-select:not(.ant-select-customize-input)::v-deep(
            .ant-select-selector
          ) {
          border: none !important;
        }

        .ant-select-focused:not(.ant-select-disabled).ant-select:not(
            .ant-select-customize-input
          )::v-deep(.ant-select-selector) {
          border: none !important;
          box-shadow: none !important;
        }

        ::v-deep(.ant-select-selector) {
          height: 100% !important;
        }

        ::v-deep(.ant-select-selection-item) {
          display: flex;
          justify-content: center;
          align-items: center;
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
    .topKey{
      width: 75%;
      margin: 22px auto 15px;
      display: flex;
      li{
        background: #fff;
        color: var(--themeColor);
        margin: 0 12px;
        border-radius: 4px;
        transition: all .2s;
        cursor: pointer;
        padding: 1px 5px;
        &:hover{
          color: #fff;
          background: var(--themeColor);
        }
      }
    }
  }
}
</style>
