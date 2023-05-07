<template>
    <div class="online-resume-container">
        <div class="userinfo-container">
            <img class="user-avatar" :src="data.avatar" alt="">
            <div class="userinfo">
                <p>
                    <span class="username">{{ data.name }}</span><component :is="data.gender === '0' ? femaleIcon : maleIcon"></component>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onlineResume } from '@/api'
import maleIcon from '@/components/common/maleIcon/index.vue'
import femaleIcon from '@/components/common/femaleIcon/index.vue'
const props = defineProps({
    userId: {
        type: String
    }
})
interface dataType {
    address: string,
    advantage: string,
    age: number,
    apply_state: string,
    avatar: string,
    born: string,
    degree: string,
    email: string,
    enter_schoolTime: string,
    gender: string,
    hope_city: string,
    hope_industry: string,
    hope_job: string,
    hope_job_type: string,
    hope_salary: string,
    identity: string,
    leave_schoolTime: string,
    major: string,
    name:string,
    phone: string,
    resume: [],
    school: string,
    school_exp: string,
    school_type: string
}
const propertyMap = {
    address: '地址',
    advantage: '个人优势',
    age: '年龄',
    apply_state: '是否离职',
    avatar: '头像',
    born: '出生年月',
    degree: '学历',
    email: '邮箱',
    enter_schoolTime: '入学时间',
    gender: '性别',
    hope_city: '期望城市',
    hope_industry: '期望行业',
    hope_job: '期望岗位',
    hope_job_type: '期望职位类型',
    hope_salary: '期望薪资',
    identity: '身份',
    leave_schoolTime: '毕业时间',
    major: '专业',
    name: '姓名',
    phone: '手机号',
    resume: '工作经历',
    school: '学校',
    school_exp: '在校经历',
    school_type: '学校类型'
}
const userId = computed(() => props.userId)
const data: Record<any, any> = ref({})
const getUserResume = (userId: string) => {
    onlineResume(userId).then(res => {
        console.log(res)
        data.value = res.data
    })
}
watch(userId, (newVal, oldVal) => {
    getUserResume(newVal as string)
}, { deep: true, immediate: true })

</script>

<style lang="less" scoped>
.online-resume-container{
    width: 100%;
    min-height: 250px;
    border: 1px solid #bebebe;
    border-radius: 10px;
    padding: 15px;
    .userinfo-container{
        width: 95%;
        height: 300px;
        display: flex;
        .user-avatar{
            width: 80px;
            height: 100px;
            display: block;
        }
        .userinfo{
            width: calc(100% - 100px);
            margin-left: 20px;
            height: 300px;
            .username{
                font-size: 26px;
                font-weight: bold;
            }
        }
    }
}
</style>