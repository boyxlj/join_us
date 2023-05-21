<template>
  <div class="positionCard" v-if="data.length">
      <div class="title">{{ title }}</div>
      <div class="box">
        <div class="item" @click="navigateDetails(item.position_id)" v-for="item in data" :key="item.id">
          <li class="top">
            <span class="name">{{ item.position_name }}</span>
            <span class="salary">{{ item.salary }}</span>
          </li>
          <li class="bottom">
            <span class="company">{{ item.company_name }}</span>
            <span class="city">{{ item.cityName }} <b v-if="item.region"></b>{{ item.region }}</span>
          </li>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import {useHotSearchPosition} from "@/store/position"
import {Iposition_type} from '@/types/jobType'
const {randomPositionData,sortPositionData} = useHotSearchPosition()

const data = ref<Iposition_type[]>(randomPositionData)

 const props =  withDefaults(defineProps<{origin?:string,title?:string,dataList?:any}>(),{
    title:'推荐职位',
    dataList:[],
    origin:'random'   //sort,random
  })

  const navigateDetails = (id:string)=>{
    if(id){
      window.open(`/home/jobDetail?position_id=${id}`)
    }

  }

if(props.origin == 'sort'){
  data.value = sortPositionData
}else{
  data.value = randomPositionData
}

if(props.dataList?.length){
  data.value = props.dataList
}
 

</script>

<style lang='less' scoped> 
.positionCard{
  width: 100%;
  min-height:80px ;
  background: #fff;
  border-radius: var(--radiusSize); 
  padding: 6px 8px 10px 8px;
  box-sizing:border-box;
  margin-bottom: 20px;
  
  .title{
    height: 46px;
    background: linear-gradient(90deg,#f5fcfc,#fcfbfa);
    border-radius:  var(--radiusSize)  var(--radiusSize) 0 0;
    font-size: 16px;
    font-weight: 500;
    color: #222;
    line-height:46px ;
    padding-left: 16px;
    box-sizing:border-box;
  }
  .box{
    background: #fff;
    min-height: 100px;
    padding: 4px 0px;
    box-sizing:border-box;
    .item{
      cursor: pointer;
      height: 65px;
      padding: 0 15px;
      box-sizing:border-box;
      border-radius:  4px;
      display: flex;
      width: 100%;
      flex-direction:column;
      justify-content: center;
      transition: all .2s linear;
      &:hover{
        background: #f7f7f7;
        .top{
          .name{
            color: var(--themeColor);
          }
        }
      }
      .top,.bottom{
        display: flex;
        justify-content: space-between;
      }
      .top{
        font-size: 16px;
        .name{
          max-width: 50%;
          overflow: hidden;
          text-overflow: ellipsis;
          font-weight: 500;
          white-space: nowrap;
          color: #333;
          transition: all .2s linear;
        }
        .salary{
          color: #fe574a;
          line-height: 20px;
          font-weight: 500;
          max-width: 50%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      .bottom{
        margin-top: 2px;
        font-size: 12px;
          color: #999;
        .company{
          max-width: 50%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .city{
          max-width: 50%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }

  }
}
</style>