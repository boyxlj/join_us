<template>
  <div class="consultDetail">
    <SelectConsult :consultData="consultData" />
  </div>
</template>

<script setup lang="ts">
import {selectConsultOne} from "@/api"
import {IConsultData } from "@/types/consult"
import SelectConsult from "./components/selectConsult/index.vue"
const route = useRoute()
const router = useRouter()
const consultData = ref<IConsultData[]>([])
onMounted(()=>{
  getConsultDetail()
})
const getConsultDetail = async()=>{
  const res:any =await selectConsultOne(route.query.consult_id as string)
  if(res.code!==200 || !res.data.length){
    return router.replace("/notfound")
  }
  consultData.value = res.data
  if(res.data[0]?.title){
    document.title=res.data[0]?.title
  }
}
</script>

<style lang='less' scoped> 
.consultDetail{
  width: 1080px;
  min-height: 400px;
  background: #fff;
  margin: 20px auto 40px;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 20px 50px 40px;

}
</style>