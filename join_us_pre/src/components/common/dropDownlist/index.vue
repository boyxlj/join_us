<template>
  <div class="downList">
    <div class="top" @mouseleave="showBoxList = false" @mouseenter="showBoxList = true" :class="activeValue?'selectActive':''">
      {{ names }}<span class="arrow"></span>
      <div v-show="showBoxList" class="bottom" ref="itemBox" :style="{minWidth:customStyle.width} ">
        <div class="box" :style="{maxHeight:customStyle.height} " @click.capture="clickItem">
          <li v-for="(item,index) in itemList" :key="index" >{{ item.name }}</li>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type TStyle = {
  width: string;
  height: string;
};
const props = withDefaults(
  defineProps<{ itemList: any; selectValue: string; customStyle?: any,idx:number,conditionName:string }>(),
  {
    itemList: [] as any,
    selectValue: "",
    customStyle: {
      width: "140px",
      height: "300px",
    },
  }
);



const names = ref(props.conditionName)
const activeValue = ref(false)
watch(()=>props.selectValue,()=>{
  names.value = props.selectValue
  if(props.selectValue!=='不限'){
    activeValue.value = true
  }else{
    activeValue.value = false
  }
})

const showBoxList = ref(false)

const emit = defineEmits(["change"]);
const itemBox = ref<HTMLDivElement>()
const clickItem = (e:any) => {
  if (e.target.children.length) return;
  emit("change", e.target.innerText,props.idx);
  showBoxList.value = true
  if(showBoxList.value){
    showBoxList.value = false
  }else{
    showBoxList.value = true
  }
};
</script>

<style lang="less" scoped>
.downList {
  min-width: 100px;
  height: 32px;
  cursor: pointer;
  
  .top {
    width: 100%;
    height: 32px;
    padding: 0 10px;
    box-sizing: border-box;
    background: skyblue;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    font-weight: 400;
    color: #222;
    border-radius: 6px;
    position: relative;
    background: #f8f8f8;
    border-radius: 4px;
    
    span {
      border: 5px solid transparent;
      border-top: 5px solid rgb(195, 195, 195);
      margin-left: 8px;
      position: relative;
      top: 3px;
    }
    transition: all 0.2s linear;
    &:hover {
      background: var(--shallowThemeColor);
      color: var(--themeColor);
      span {
        transform: rotate(180deg);
        border-top: 5px solid var(--themeColor);
        position: relative;
        top: -1px;
      }
     
    }
    .bottom {
      position: absolute;
      min-width: 160px;
      max-width: 350px;
      top: 32px;
      z-index: 999;
      transition: all 0.2s linear;
      left: 0;
      padding: 5px 0;
      box-sizing: border-box;
      overflow: hidden;
      .box {
        height: 100%;
        background: #fff;
        border-radius: 10px;
        border: 1px solid #ebeef5;
        min-height: 40px;
        max-height: 260px;
        overflow-y: scroll;
        padding: 8px 0;
        box-sizing: border-box;
        li {
          font-size: 13px;
          color: #333;
          height: 30px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          transition: all 0.2s linear;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-left: 4px;
          padding: 0 8px 0 12px;
          box-sizing: border-box;
          &:hover {
            color: var(--themeColor);
            background: #f8f8f8;
          }
        }
      }
    }
  }
  .selectActive{
    background: var(--shallowThemeColor);
      color: var(--themeColor);
  }
}
</style>
