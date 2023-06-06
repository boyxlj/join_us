<template>
    <div class="salary-caculate-container">
        <p>工资计算器</p>
        <input style="outline: none;" v-model.number="inputSalary" class="salary-input" placeholder="请输入税前工资" />
        <span style="position: absolute; right: 40px; top: 68px;font-weight: bold; color: var(--themeColor);">元</span>
        <a-button @click="salaryCaculateDialog" class="btn">开始计算</a-button>
        <a-modal centered okText="确定"  cancelText="取消" style="text-align: center;" v-model:visible="visible" title="薪资计算器" @ok="handleOk">
            <a-spin v-show="isShown" size="large" />
            <p v-show="isShown">正在计算.......</p>
            <p v-show="!isShown" class="content">
                经过计算<br>
                您的薪资是税前薪资<span style="color: var(--themeColor); font-size: 18px; font-weight: bold;">{{ netSalary.grossSalary }}元</span><br>
                您的税率为<span style="color: var(--themeColor); font-size: 18px; font-weight: bold;">{{ netSalary.taxRate }}</span><br>
                您需要缴纳税额为<span style="color: var(--themeColor); font-size: 18px; font-weight: bold;">{{ netSalary.taxAmout }}元</span><br>
                您的税后薪资为<span style="color: var(--themeColor); font-size: 18px; font-weight: bold;">{{ netSalary.netSalary }}元</span>
            </p>
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import { message } from "ant-design-vue"

let inputSalary = ref<number>(0)
const visible = ref(false)
const isShown = ref(true)
let timer: any = null
let netSalary = ref<taxObj>({
    grossSalary: 0,
    taxRate: 0,
    taxAmout: 0,
    netSalary: 0
})
interface taxObj {
    grossSalary: number,
    taxRate: number,
    taxAmout: number,
    netSalary: number
}
// 计算纳税金额
const getNetSalary = (salaryNum: number): taxObj => {
    let taxRate = 0;
    if (salaryNum <= 3000 && salaryNum >= 0) {
        taxRate = 0
    } else if (salaryNum <= 8000 && salaryNum > 3000) {
        taxRate = 0.105
    } else if (salaryNum <= 15000 && salaryNum > 8000) {
        taxRate = 0.185
    } else {
        taxRate = 0.225
    }
    return {
        grossSalary: salaryNum,
        taxRate: taxRate,
        taxAmout: salaryNum * taxRate,
        netSalary: salaryNum - (salaryNum * taxRate)
    }
}
const salaryCaculateDialog = () => {
  if(inputSalary.value<=0){
    return message.warning("请输入合法的薪资")
  }
    visible.value = !visible.value
    netSalary.value = getNetSalary(Number(inputSalary.value))
    if (isShown.value) {
        timer = setTimeout(() => {
            isShown.value = false
        }, 1500)
    } else {
        isShown.value = true
        timer = setTimeout(() => {
            isShown.value = false
        }, 1500)
    }
}
const handleOk = () => {
    visible.value = false
    clearTimeout(timer)
}
</script>

<style lang="less" scoped>
.salary-caculate-container {
    width: 350px;
    height: 200px;
    border-radius: 14px;
    border: 1px solid var(--themeColor);
    background: linear-gradient(to bottom, var(--themeColor) 50%, #fff 100%);
    text-align: center;
    position: relative;

    p {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        color: #fff;
    }
 

    .salary-input {
        width: 300px;
        height: 40px;
        border-radius: 10px;
        border-color: var(--themeColor);
    }

    .btn {
        margin-top: 30px;
        width: 300px;
        background-color: var(--themeColor);
        color: #fff;
        font-weight: bold;

        &:hover {
            background-color:  var(--btnHoverThemeColor);
        }
    }
    .loading{
        width: 60px;
        height: 60px;
        background-color: #8964cf;
    }
}

.content{
      span{
        display: inline-block;
        margin-left: 10px;
      }
    }</style>