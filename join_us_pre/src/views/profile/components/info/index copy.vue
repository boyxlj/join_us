<template>
  <div class="hoveList infoBox">
    <div class="tips">编辑个人信息</div>
    <div class="formList">
      <div class="infoItem" v-for="item in 6" :key="item">
        <span>姓名</span>
        <div class="forms">
          <input type="text" />
        </div>
      </div>
    </div>
    <div class="buttons">
      <li class="cancel">取消</li>
      <li class="ok">完成</li>
    </div>
  </div>
</template>

<script setup lang="ts">
const InfoFormValue = reactive({
  info:'',
  advantage:'',
  hope_job:'',
  work_exp:'',
  project_exp:'',
  project_exp:'',
  education_exp:''

})

</script>

<style lang="less" scoped>
.infoBox {
  width: 100%;
  height: 390px;
  padding: 24px 20px;
  box-sizing: border-box;
  background: #f1f1f1;
  .tips {
    font-size: 14px;
    color: #222;
    margin-bottom: 14px;
  }
  .formList {
    widows: 100%;
    height: 240px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .infoItem {
      width: 47%;
      height: 70px;
      display: flex;
      justify-content: center;
      flex-direction: column;
      margin-bottom: 6px;
      span {
        margin-bottom: 8px;
      }
      .forms {
        height: 53px;
        input {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .buttons {
    height: 80px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    li {
      width: 116px;
      height: 35px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.2s linear;
      font-size: 14px;
      color: #414a60;
      background: #fff;
    }
    .cancel {
      border: 1px solid #e3e7ed;
      &:hover {
        background: #f7f7f7;
      }
      margin-right: 28px;
    }
    .ok {
      color: #fff;
      background: var(--themeColor);
      &:hover {
        background: var(--btnHoverThemeColor);
      }
    }
  }
}
</style>
